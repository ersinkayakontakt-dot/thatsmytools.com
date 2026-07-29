<?php
/**
 * SCHNELLHELFER24 – ANFRAGE-ENDPUNKT
 * ==================================
 *
 * Nimmt das Anfrageformular entgegen, prüft die Eingaben serverseitig,
 * speichert Fotos sicher, verschickt die Anfrage per E-Mail und leitet
 * auf die Bestätigungsseite weiter.
 *
 * WARUM PHP: Die Website wird statisch ausgeliefert und läuft damit auf
 * jedem Hosting. PHP ist auf klassischen Webhosting-Tarifen (unter anderem
 * bei Hostinger) ohne Zusatzkosten vorhanden, während Node.js dort
 * entweder fehlt oder einen teureren Tarif erfordert. Siehe
 * docs/ARCHITEKTUR.md.
 *
 * EINRICHTUNG (siehe SEO-LAUNCH-CHECKLIST.md):
 *   1. config.local.php neben dieser Datei anlegen (Vorlage:
 *      config.example.php) und die Empfängeradresse eintragen.
 *   2. Verzeichnis _storage/ beschreibbar machen (0700 genügt).
 *   3. Testanfrage senden und prüfen, ob die E-Mail ankommt.
 *
 * SICHERHEIT
 *   - Nur POST, nur multipart/form-data
 *   - Honeypot-Feld und Zeitfalle gegen automatisierte Einsendungen
 *   - Rate Limiting je IP-Hash
 *   - Bildprüfung über den tatsächlichen Inhalt, nicht über die Endung
 *   - Zufällige Dateinamen, kein Verzeichnislisting, .htaccess-Sperre
 *   - Header-Injection in der E-Mail ausgeschlossen
 *   - Keine Zugangsdaten im Frontend
 *
 * VORAUSSETZUNG: PHP 8.0 oder neuer.
 */

declare(strict_types=1);

/* ------------------------------------------------------------------ */
/* Konfiguration                                                       */
/* ------------------------------------------------------------------ */

$config = [
    // Empfänger der Anfragen. MUSS in config.local.php gesetzt werden.
    'recipient'      => '',

    // Absender. Sollte eine Adresse der eigenen Domain sein, sonst
    // landen die Mails im Spam (SPF/DKIM).
    'from'           => '',
    'fromName'       => 'Schnellhelfer24 Website',

    'siteUrl'        => 'https://schnellhelfer24.de',
    'successPath'    => '/anfrage-erhalten/',
    'errorPath'      => '/angebot-anfragen/?fehler=1',

    // Ablage. Auf Wunsch auf einen Pfad OBERHALB des Webverzeichnisses
    // zeigen lassen, das ist die sicherste Variante.
    'storageDir'     => __DIR__ . '/_storage',

    'maxFiles'       => 12,
    'maxFileBytes'   => 8 * 1024 * 1024,
    'maxTotalBytes'  => 60 * 1024 * 1024,

    // Rate Limiting
    'rateWindow'     => 3600,   // Sekunden
    'rateMax'        => 5,      // Anfragen je IP im Zeitfenster

    // Zeitfalle: schneller als das kann ein Mensch das Formular nicht
    // ausfüllen. Wert in Millisekunden.
    'minFillMs'      => 4000,

    // Aufbewahrung der Uploads in Tagen. Ältere Dateien werden bei
    // Gelegenheit automatisch gelöscht. Muss zur Datenschutzerklärung passen.
    'retentionDays'  => 90,
];

if (is_file(__DIR__ . '/config.local.php')) {
    $local = require __DIR__ . '/config.local.php';
    if (is_array($local)) {
        $config = array_merge($config, $local);
    }
}

/* ------------------------------------------------------------------ */
/* Hilfsfunktionen                                                     */
/* ------------------------------------------------------------------ */

/** Bricht ab und leitet mit einer Fehlermeldung zurück. */
function fail(string $reason, array $config, int $status = 400)
{
    error_log('[schnellhelfer24] Anfrage abgelehnt: ' . $reason);
    http_response_code($status);
    $sep = str_contains($config['errorPath'], '?') ? '&' : '?';
    header('Location: ' . $config['siteUrl'] . $config['errorPath'] . $sep . 'grund=' . rawurlencode($reason));
    exit;
}

/**
 * Beendet die Verarbeitung stillschweigend mit einer Erfolgsmeldung.
 * Wird bei erkanntem Spam verwendet: Der Absender soll nicht erfahren,
 * dass die Erkennung gegriffen hat.
 */
function silentOk(array $config)
{
    header('Location: ' . $config['siteUrl'] . $config['successPath']);
    exit;
}

/** Entfernt Steuerzeichen und begrenzt die Länge. */
function clean(?string $value, int $maxLength = 500): string
{
    if ($value === null) {
        return '';
    }
    $value = str_replace(["\0"], '', $value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    $value = trim($value);
    if (mb_strlen($value) > $maxLength) {
        $value = mb_substr($value, 0, $maxLength);
    }
    return $value;
}

/** Verhindert Header-Injection in E-Mail-Kopfzeilen. */
function headerSafe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
}

/** Pseudonymisierter IP-Schlüssel für das Rate Limiting. */
function ipKey(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    // Gehasht und gesalzen: Damit lässt sich zählen, ohne die IP-Adresse
    // im Klartext zu speichern.
    return substr(hash('sha256', $ip . '|sh24-rate-limit'), 0, 32);
}

/** Legt ein Verzeichnis mit restriktiven Rechten an. */
function ensureDir(string $dir): bool
{
    if (is_dir($dir)) {
        return true;
    }
    return @mkdir($dir, 0700, true) || is_dir($dir);
}

/* ------------------------------------------------------------------ */
/* 1. Methode und Grundprüfungen                                       */
/* ------------------------------------------------------------------ */

header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: same-origin');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    header('Location: ' . $config['siteUrl'] . '/angebot-anfragen/');
    exit;
}

if ($config['recipient'] === '') {
    // Ohne Empfänger würde die Anfrage ins Leere laufen. Lieber ein
    // klarer Fehler als eine stille Datenvernichtung.
    error_log('[schnellhelfer24] Kein Empfänger konfiguriert. config.local.php anlegen.');
    fail('nicht-konfiguriert', $config, 500);
}

/* ------------------------------------------------------------------ */
/* 2. Spam-Erkennung                                                   */
/* ------------------------------------------------------------------ */

// Honeypot: Das Feld ist für Menschen unsichtbar. Ist es gefüllt,
// war ein Programm am Werk.
if (clean($_POST['webseite'] ?? '') !== '') {
    silentOk($config);
}

// Zeitfalle
$started = (int) ($_POST['gestartet'] ?? 0);
if ($started > 0) {
    $elapsed = (int) round(microtime(true) * 1000) - $started;
    if ($elapsed < $config['minFillMs']) {
        silentOk($config);
    }
}

/* ------------------------------------------------------------------ */
/* 3. Rate Limiting                                                    */
/* ------------------------------------------------------------------ */

$storage = $config['storageDir'];
$rateDir = $storage . '/rate';

if (!ensureDir($storage) || !ensureDir($rateDir)) {
    error_log('[schnellhelfer24] Ablageverzeichnis nicht beschreibbar: ' . $storage);
    fail('speicher-nicht-verfuegbar', $config, 500);
}

$rateFile = $rateDir . '/' . ipKey() . '.json';
$now      = time();
$hits     = [];

if (is_file($rateFile)) {
    $decoded = json_decode((string) @file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $hits = array_values(array_filter(
            $decoded,
            static fn($t) => is_int($t) && $t > $now - $config['rateWindow']
        ));
    }
}

if (count($hits) >= $config['rateMax']) {
    http_response_code(429);
    header('Retry-After: ' . $config['rateWindow']);
    echo 'Zu viele Anfragen in kurzer Zeit. Bitte rufen Sie uns an oder versuchen Sie es später erneut.';
    exit;
}

$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits), LOCK_EX);

/* ------------------------------------------------------------------ */
/* 4. Eingaben prüfen                                                  */
/* ------------------------------------------------------------------ */

$fields = [
    'leistung'    => clean($_POST['leistung'] ?? '', 120),
    'plz'         => clean($_POST['plz'] ?? '', 5),
    'ort'         => clean($_POST['ort'] ?? '', 120),
    'objektart'   => clean($_POST['objektart'] ?? '', 120),
    'fuellgrad'   => clean($_POST['fuellgrad'] ?? '', 60),
    'etage'       => clean($_POST['etage'] ?? '', 60),
    'aufzug'      => clean($_POST['aufzug'] ?? '', 30),
    'zeitraum'    => clean($_POST['zeitraum'] ?? '', 80),
    'stichtag'    => clean($_POST['stichtag'] ?? '', 20),
    'beschreibung'=> clean($_POST['beschreibung'] ?? '', 2000),
    'name'        => clean($_POST['name'] ?? '', 120),
    'telefon'     => clean($_POST['telefon'] ?? '', 40),
    'mail'        => clean($_POST['mail'] ?? '', 190),
    'kontaktart'  => clean($_POST['kontaktart'] ?? '', 30),
    'quelle'      => clean($_POST['quelle'] ?? '', 120),
];

$nebenraeume = [];
if (isset($_POST['nebenraeume']) && is_array($_POST['nebenraeume'])) {
    foreach (array_slice($_POST['nebenraeume'], 0, 10) as $raum) {
        $value = clean(is_string($raum) ? $raum : '', 40);
        if ($value !== '') {
            $nebenraeume[] = $value;
        }
    }
}

$errors = [];

if ($fields['leistung'] === '')            { $errors[] = 'leistung'; }
if (!preg_match('/^\d{5}$/', $fields['plz'])) { $errors[] = 'plz'; }
if ($fields['objektart'] === '')           { $errors[] = 'objektart'; }
if ($fields['etage'] === '')               { $errors[] = 'etage'; }
if ($fields['aufzug'] === '')              { $errors[] = 'aufzug'; }
if ($fields['zeitraum'] === '')            { $errors[] = 'zeitraum'; }
if ($fields['name'] === '')                { $errors[] = 'name'; }
if ($fields['kontaktart'] === '')          { $errors[] = 'kontaktart'; }
if (($_POST['datenschutz'] ?? '') !== 'ja'){ $errors[] = 'datenschutz'; }

// Eine erreichbare Telefonnummer ist Pflicht: Für eine belastbare
// Einschätzung muss in der Regel nachgefragt werden.
$digits = preg_replace('/\D/', '', $fields['telefon']) ?? '';
if (strlen($digits) < 7) {
    $errors[] = 'telefon';
}

if ($fields['mail'] !== '' && !filter_var($fields['mail'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'mail';
}

if ($errors !== []) {
    fail('unvollstaendig:' . implode(',', $errors), $config, 422);
}

/* ------------------------------------------------------------------ */
/* 5. Fotos entgegennehmen                                             */
/* ------------------------------------------------------------------ */

/**
 * Erlaubte Bildtypen. Geprüft wird der tatsächliche Dateiinhalt,
 * nicht die vom Browser gemeldete Endung oder der MIME-Typ.
 */
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/heic' => 'heic',
    'image/heif' => 'heif',
];

$uploadDir = $storage . '/uploads/' . date('Y-m');
$saved     = [];
$rejected  = [];
$totalSize = 0;

if (!empty($_FILES['fotos']['name'][0])) {
    if (!ensureDir($uploadDir)) {
        error_log('[schnellhelfer24] Upload-Verzeichnis nicht anlegbar: ' . $uploadDir);
        fail('speicher-nicht-verfuegbar', $config, 500);
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $count = min(count($_FILES['fotos']['name']), $config['maxFiles']);
    $token = bin2hex(random_bytes(6));

    for ($i = 0; $i < $count; $i++) {
        if (($_FILES['fotos']['error'][$i] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            continue;
        }

        $tmp  = $_FILES['fotos']['tmp_name'][$i];
        $size = (int) ($_FILES['fotos']['size'][$i] ?? 0);

        if (!is_uploaded_file($tmp)) {
            continue;
        }
        if ($size <= 0 || $size > $config['maxFileBytes']) {
            $rejected[] = clean((string) $_FILES['fotos']['name'][$i], 100) . ' (zu groß)';
            continue;
        }
        if ($totalSize + $size > $config['maxTotalBytes']) {
            $rejected[] = clean((string) $_FILES['fotos']['name'][$i], 100) . ' (Gesamtgröße überschritten)';
            continue;
        }

        // Typ anhand des Inhalts bestimmen
        $mime = $finfo ? (finfo_file($finfo, $tmp) ?: '') : '';
        if (!isset($allowed[$mime])) {
            $rejected[] = clean((string) $_FILES['fotos']['name'][$i], 100) . ' (kein unterstütztes Bildformat)';
            continue;
        }

        // Zusätzliche Prüfung für die klassischen Formate: Lässt sich das
        // Bild überhaupt als Bild lesen? Verhindert als Bild getarnte Dateien.
        if (in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) {
            $info = @getimagesize($tmp);
            if ($info === false) {
                $rejected[] = clean((string) $_FILES['fotos']['name'][$i], 100) . ' (beschädigt)';
                continue;
            }
        }

        // Zufälliger Dateiname. Der Originalname wird nicht übernommen:
        // Er kann Pfadanteile, Steuerzeichen oder personenbezogene
        // Angaben enthalten.
        $target = sprintf('%s/%s-%02d.%s', $uploadDir, $token, $i + 1, $allowed[$mime]);
        if (@move_uploaded_file($tmp, $target)) {
            @chmod($target, 0600);
            $saved[] = $target;
            $totalSize += $size;
        }
    }

    if ($finfo) {
        finfo_close($finfo);
    }
}

/* ------------------------------------------------------------------ */
/* 6. Alte Uploads aufräumen (Löschfrist einhalten)                    */
/* ------------------------------------------------------------------ */

// Läuft nur gelegentlich, um jede Anfrage schnell zu halten.
if (random_int(1, 20) === 1) {
    $cutoff = $now - ($config['retentionDays'] * 86400);
    foreach (glob($storage . '/uploads/*/*') ?: [] as $old) {
        if (is_file($old) && @filemtime($old) < $cutoff) {
            @unlink($old);
        }
    }
    foreach (glob($rateDir . '/*.json') ?: [] as $oldRate) {
        if (is_file($oldRate) && @filemtime($oldRate) < $now - $config['rateWindow'] * 2) {
            @unlink($oldRate);
        }
    }
}

/* ------------------------------------------------------------------ */
/* 7. Anfrage zustellen                                                */
/* ------------------------------------------------------------------ */

$ref = sprintf('SH-%s-%s', date('ymd'), strtoupper(substr(bin2hex(random_bytes(3)), 0, 5)));

$lines = [
    'Neue Anfrage über schnellhelfer24.de',
    'Referenz: ' . $ref,
    'Eingegangen: ' . date('d.m.Y H:i'),
    '',
    '--- Kontakt ---------------------------------------',
    'Name:            ' . $fields['name'],
    'Telefon:         ' . $fields['telefon'],
    'E-Mail:          ' . ($fields['mail'] !== '' ? $fields['mail'] : '(nicht angegeben)'),
    'Antwort bitte per:' . ' ' . $fields['kontaktart'],
    '',
    '--- Auftrag ---------------------------------------',
    'Leistung:        ' . $fields['leistung'],
    'PLZ / Ort:       ' . $fields['plz'] . ($fields['ort'] !== '' ? ' ' . $fields['ort'] : ''),
    'Objektart:       ' . $fields['objektart'],
    'Füllgrad:        ' . $fields['fuellgrad'],
    'Etage:           ' . $fields['etage'],
    'Aufzug:          ' . $fields['aufzug'],
    'Nebenräume:      ' . ($nebenraeume !== [] ? implode(', ', $nebenraeume) : '(keine angegeben)'),
    'Zeitraum:        ' . $fields['zeitraum'],
    'Fester Termin:   ' . ($fields['stichtag'] !== '' ? $fields['stichtag'] : '(keiner)'),
    '',
    '--- Beschreibung ----------------------------------',
    $fields['beschreibung'] !== '' ? $fields['beschreibung'] : '(keine)',
    '',
    '--- Fotos -----------------------------------------',
    'Übernommen:      ' . count($saved),
];

foreach ($saved as $file) {
    $lines[] = '  ' . basename($file);
}
if ($rejected !== []) {
    $lines[] = 'Abgelehnt:';
    foreach ($rejected as $r) {
        $lines[] = '  ' . $r;
    }
}

$lines[] = '';
$lines[] = 'Ablage: ' . $uploadDir;
$lines[] = 'Herkunft: ' . ($fields['quelle'] !== '' ? $fields['quelle'] : '(unbekannt)');
$lines[] = '';
$lines[] = 'Löschfrist der Fotos: ' . $config['retentionDays'] . ' Tage nach Eingang.';

$body = implode("\r\n", $lines);

$subject = sprintf(
    '[Anfrage %s] %s, %s %s',
    $ref,
    $fields['leistung'],
    $fields['plz'],
    $fields['ort'] !== '' ? $fields['ort'] : ''
);

$from = $config['from'] !== '' ? $config['from'] : $config['recipient'];

$headers = [
    'From: ' . headerSafe($config['fromName']) . ' <' . headerSafe($from) . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Anfrage-Referenz: ' . $ref,
];

// Antwort-an nur setzen, wenn eine gültige Adresse vorliegt.
if ($fields['mail'] !== '') {
    $headers[] = 'Reply-To: ' . headerSafe($fields['mail']);
}

// Envelope-Absender nur setzen, wenn es eine saubere Adresse ist.
// Ungeprüft in die Kommandozeile von sendmail zu reichen wäre riskant.
$envelope = filter_var($from, FILTER_VALIDATE_EMAIL) ? '-f' . $from : '';

$sent = @mail(
    headerSafe($config['recipient']),
    headerSafe($subject),
    $body,
    implode("\r\n", $headers),
    $envelope
);

// Immer zusätzlich als Datei sichern. Wenn der Mailversand auf dem
// Hosting nicht funktioniert, geht die Anfrage trotzdem nicht verloren.
$inboxDir = $storage . '/anfragen';
if (ensureDir($inboxDir)) {
    $record = $fields;
    $record['nebenraeume'] = $nebenraeume;
    $record['referenz']    = $ref;
    $record['zeit']        = date('c');
    $record['fotos']       = array_map('basename', $saved);
    $record['mailVersand'] = $sent ? 'ok' : 'fehlgeschlagen';

    @file_put_contents(
        $inboxDir . '/' . date('Y-m-d') . '-' . $ref . '.json',
        json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

if (!$sent) {
    error_log('[schnellhelfer24] Mailversand fehlgeschlagen für ' . $ref . '. Anfrage liegt unter ' . $inboxDir);
}

/* ------------------------------------------------------------------ */
/* 8. Weiterleiten                                                     */
/* ------------------------------------------------------------------ */

header('Location: ' . $config['siteUrl'] . $config['successPath']);
exit;
