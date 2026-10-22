<?php
/**
 * SCHNELLHELFER24 – BETRIEBSBEREICH (GROW-2026-01)
 * ================================================
 *
 * Interne Seite für den Betreiber. Zwei Aufgaben:
 *   1. Ergebnis je Anfrage erfassen (Status, Absagegrund, Wertklasse,
 *      nötige Rückfragen, Versorgungslücke) – etwa 20 Sekunden je Anfrage.
 *   2. Das Nachfrageverzeichnis anzeigen und als CSV ausgeben.
 *
 * Es werden KEINE Kontaktdaten angezeigt oder gespeichert. Die Zuordnung
 * erfolgt über die Referenz (SH-…), die in Betreff und Mail jeder Anfrage
 * steht. Ablauf und Regeln: docs/NACHFRAGE-SYSTEM.md.
 *
 * EINRICHTUNG (einmalig, in sh24-config.php oberhalb von public_html):
 *   'betriebPasswortHash' => '<Ausgabe von: php scripts/betrieb-passwort.php>',
 *   'betriebGeheimnis'    => '<mindestens 32 zufällige Zeichen>',
 * Ohne beide Werte antwortet diese Seite mit 503 und tut nichts.
 *
 * SICHERHEIT
 *   - Anmeldung per Passwort (password_verify), höchstens 5 Versuche je
 *     15 Minuten und pseudonymisierter Adresse
 *   - Sitzung als HMAC-signiertes Cookie mit Ablaufzeit, HttpOnly, Secure,
 *     SameSite=Strict, nur für diesen Pfad
 *   - Jede Änderung braucht ein CSRF-Token, das an die Sitzung gebunden ist
 *   - Ausgabe durchgehend über htmlspecialchars
 *   - noindex, no-store, eigene CSP
 */

declare(strict_types=1);

require_once __DIR__ . '/lib/config.php';
require_once __DIR__ . '/lib/nachfrage.php';
require_once __DIR__ . '/lib/betrieb-auth.php';

$config = [
    'storageDir'          => __DIR__ . '/_storage',
    'betriebPasswortHash' => '',
    'betriebGeheimnis'    => '',
    'betriebCookieSecure' => true,
];
[$local] = sh24_load_local_config(__DIR__);
$config = array_merge($config, $local);

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
header('Content-Type: text/html; charset=utf-8');

const SH24_COOKIE = 'sh24_betrieb';

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sh24_betrieb_ready(array $config): bool
{
    return (string) $config['betriebPasswortHash'] !== '' && strlen((string) $config['betriebGeheimnis']) >= 32;
}

/** Login-Begrenzung je pseudonymisierter Adresse. @return bool true = weiterer Versuch erlaubt */
function sh24_login_allowed(string $storage, int $now, bool $record): bool
{
    $dir = rtrim($storage, '/') . '/rate';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $key = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '0') . '|sh24-betrieb-login'), 0, 32);
    $file = $dir . '/betrieb-' . $key . '.json';
    $hits = [];
    if (is_file($file)) {
        $decoded = json_decode((string) @file_get_contents($file), true);
        if (is_array($decoded)) {
            $hits = array_values(array_filter($decoded, static fn($t) => is_int($t) && $t > $now - 900));
        }
    }
    if (count($hits) >= 5) {
        return false;
    }
    if ($record) {
        $hits[] = $now;
        @file_put_contents($file, json_encode($hits), LOCK_EX);
    }
    return true;
}

function sh24_set_cookie(string $value, int $expires, bool $secure): void
{
    setcookie(SH24_COOKIE, $value, [
        'expires'  => $expires,
        'path'     => '/api/betrieb.php',
        'secure'   => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
}

function sh24_page(string $title, string $body): void
{
    echo '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<meta name="robots" content="noindex,nofollow"><title>' . h($title) . ' · Schnellhelfer24 Betrieb</title><style>'
        . 'body{font:15px/1.5 system-ui,sans-serif;margin:0;background:#f7f6f2;color:#1f2a24}main{max-width:1180px;margin:0 auto;padding:16px}'
        . 'h1{font-size:1.4rem;margin:.2rem 0 1rem}h2{font-size:1.1rem;margin:1.6rem 0 .5rem}nav a{margin-right:1rem;color:#1f4d3a;font-weight:600}'
        . 'table{border-collapse:collapse;width:100%;background:#fff;font-size:.88rem}th,td{border:1px solid #d8d6cc;padding:.35rem .45rem;text-align:left;vertical-align:top}'
        . 'th{background:#ecebe4}.tag{display:inline-block;background:#ecebe4;border-radius:3px;padding:0 .3rem;margin:1px;font-size:.8rem}'
        . 'select,input[type=text],input[type=password]{font:inherit;padding:.25rem;max-width:100%}button{font:inherit;padding:.35rem .8rem;background:#1f4d3a;color:#fff;border:0;border-radius:4px;cursor:pointer}'
        . '.note{background:#fff8e6;border-left:4px solid #c08a00;padding:.6rem .8rem;margin:.8rem 0}.ok{background:#e8f4ec;border-left:4px solid #2f7a4b;padding:.6rem .8rem;margin:.8rem 0}'
        . '.muted{color:#5d625d;font-size:.85rem}.scroll{overflow-x:auto}fieldset{border:0;padding:0;margin:0}label.cb{display:inline-block;margin-right:.5rem;white-space:nowrap}'
        . '</style></head><body><main>' . $body . '</main></body></html>';
    exit;
}

/* ------------------------------------------------------------------ */
/* Zugang                                                              */
/* ------------------------------------------------------------------ */

$now = time();
$storage = (string) $config['storageDir'];
$secret = (string) $config['betriebGeheimnis'];
$secure = (bool) $config['betriebCookieSecure'];

if (!sh24_betrieb_ready($config)) {
    http_response_code(503);
    sh24_page('Nicht eingerichtet', '<h1>Betriebsbereich nicht eingerichtet</h1><p>In <code>sh24-config.php</code> fehlen <code>betriebPasswortHash</code> oder <code>betriebGeheimnis</code>. Siehe docs/NACHFRAGE-SYSTEM.md.</p>');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string) ($_POST['aktion'] ?? '');
$token = (string) ($_COOKIE[SH24_COOKIE] ?? '');
$authed = $token !== '' && sh24_session_valid($secret, $token, $now);

if ($method === 'POST' && $action === 'login') {
    if (!sh24_login_allowed($storage, $now, false)) {
        http_response_code(429);
        sh24_page('Gesperrt', '<h1>Zu viele Versuche</h1><p>Bitte in 15 Minuten erneut versuchen.</p>');
    }
    if (password_verify((string) ($_POST['passwort'] ?? ''), (string) $config['betriebPasswortHash'])) {
        $expires = $now + SH24_SESSION_SECONDS;
        sh24_set_cookie(sh24_session_token($secret, $expires), $expires, $secure);
        header('Location: betrieb.php', true, 303);
        exit;
    }
    sh24_login_allowed($storage, $now, true);
    http_response_code(403);
    $authed = false;
    $loginError = true;
}

if ($method === 'POST' && $action === 'logout') {
    sh24_set_cookie('', $now - 3600, $secure);
    header('Location: betrieb.php', true, 303);
    exit;
}

if (!$authed) {
    if ($method === 'POST' && $action !== 'login') {
        http_response_code(403);
    }
    sh24_page('Anmeldung', '<h1>Betriebsbereich</h1>'
        . (isset($loginError) ? '<p class="note">Passwort nicht korrekt.</p>' : '')
        . '<form method="post" action="betrieb.php"><input type="hidden" name="aktion" value="login">'
        . '<label>Passwort <input type="password" name="passwort" autocomplete="current-password" required></label> '
        . '<button type="submit">Anmelden</button></form>'
        . '<p class="muted">Interne Seite. Hier stehen keine Kontaktdaten, nur Referenzen und gezählte Angaben.</p>');
}

$csrf = sh24_csrf($secret, $token);

/* ------------------------------------------------------------------ */
/* Ergebnis speichern                                                  */
/* ------------------------------------------------------------------ */

$saved = '';
if ($method === 'POST' && $action === 'ergebnis') {
    if (!hash_equals($csrf, (string) ($_POST['csrf'] ?? ''))) {
        http_response_code(403);
        sh24_page('Abgelehnt', '<h1>Sitzung abgelaufen</h1><p><a href="betrieb.php">Neu laden</a></p>');
    }
    $outcome = sh24_outcome_from_input($_POST, $now);
    if ($outcome === null || !sh24_outcome_append($storage, $outcome)) {
        http_response_code(422);
        sh24_page('Fehler', '<h1>Nicht gespeichert</h1><p>Referenz oder Status ungültig, oder die Ablage ist nicht beschreibbar.</p><p><a href="betrieb.php">Zurück</a></p>');
    }
    header('Location: betrieb.php?gespeichert=' . rawurlencode($outcome['ref']) . '#' . rawurlencode($outcome['ref']), true, 303);
    exit;
}

// Gelegentlich anonymisieren: alte Referenzen entfernen (SH24_REF_TAGE).
if (random_int(1, 10) === 1) {
    sh24_compact($storage, $now);
}

$entries = sh24_ledger_read($storage);
$latest = sh24_outcomes_latest($storage);

$view = (string) ($_GET['v'] ?? 'liste');
$days = max(7, min(365, (int) ($_GET['tage'] ?? 90)));
$from = date('Y-m-d', $now - $days * 86400);
$to = date('Y-m-d', $now);

/* ------------------------------------------------------------------ */
/* CSV-Export des Verzeichnisses (ohne Referenzen)                     */
/* ------------------------------------------------------------------ */

if ($view === 'export') {
    $register = sh24_demand_register(sh24_aggregate($entries, $latest, $from, $to));
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="nachfrageverzeichnis-' . $to . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['Art', 'Thema', 'Häufigkeit', 'Evidenz', 'Möglicher Auftragswert', 'Bedienbar', 'Nächster Schritt'], ';');
    foreach ($register as $r) {
        fputcsv($out, [$r['art'], $r['thema'], $r['haeufigkeit'], $r['evidenz'], $r['wert'], $r['bedienbar'], $r['schritt']], ';');
    }
    exit;
}

$nav = '<nav><a href="betrieb.php">Anfragen</a><a href="betrieb.php?v=verzeichnis">Nachfrageverzeichnis</a>'
    . '<a href="betrieb.php?v=export&amp;tage=' . $days . '">CSV</a>'
    . '<form method="post" action="betrieb.php" style="display:inline"><input type="hidden" name="aktion" value="logout"><button type="submit">Abmelden</button></form></nav>';

function sh24_tags(array $items, array $labels = []): string
{
    $out = '';
    foreach ($items as $i) {
        $out .= '<span class="tag">' . h((string) ($labels[$i] ?? $i)) . '</span>';
    }
    return $out;
}

function sh24_select(string $name, array $options, string $current): string
{
    $html = '<select name="' . h($name) . '">';
    foreach ($options as $value => $label) {
        $html .= '<option value="' . h((string) $value) . '"' . ((string) $value === $current ? ' selected' : '') . '>' . h($label) . '</option>';
    }
    return $html . '</select>';
}

/* ------------------------------------------------------------------ */
/* Ansicht: Nachfrageverzeichnis                                       */
/* ------------------------------------------------------------------ */

if ($view === 'verzeichnis') {
    $agg = sh24_aggregate($entries, $latest, $from, $to);
    $register = sh24_demand_register($agg);
    $pct = static fn(int $a, int $b): string => $b > 0 ? (string) round(100 * $a / $b) . ' %' : '–';

    $html = $nav . '<h1>Nachfrageverzeichnis</h1>'
        . '<p class="muted">Zeitraum ' . h($from) . ' bis ' . h($to) . ' · ' . (int) $agg['n'] . ' Anfragen · '
        . (int) $agg['mitErgebnis'] . ' mit Ergebnis (' . $pct((int) $agg['mitErgebnis'], (int) $agg['n']) . ') · '
        . (int) $agg['auftrag'] . ' Aufträge. Zeitraum: '
        . '<a href="betrieb.php?v=verzeichnis&amp;tage=30">30</a> · <a href="betrieb.php?v=verzeichnis&amp;tage=90">90</a> · <a href="betrieb.php?v=verzeichnis&amp;tage=365">365</a> Tage</p>';

    if ((int) $agg['n'] < 20) {
        $html .= '<p class="note">Kleine Datenbasis. Zahlen sind Hinweise aus Einzelfällen, keine belegten Trends. Entscheidungsregeln: docs/NACHFRAGE-SYSTEM.md.</p>';
    }
    if ((int) $agg['n'] > 0 && $agg['mitErgebnis'] / $agg['n'] < 0.8) {
        $html .= '<p class="note">Weniger als 80 % der Anfragen haben ein Ergebnis. Ohne Ergebnis sind Absagegründe, Lücken und Auftragsquoten unvollständig.</p>';
    }

    $html .= '<h2>Verzeichnis</h2><div class="scroll"><table><tr><th>Art</th><th>Thema</th><th>Häufigkeit</th><th>Evidenz</th><th>Möglicher Wert</th><th>Bedienbar</th><th>Nächster Schritt</th></tr>';
    foreach ($register as $r) {
        $html .= '<tr><td>' . h((string) $r['art']) . '</td><td>' . h((string) $r['thema']) . '</td><td>' . (int) $r['haeufigkeit'] . '</td><td>'
            . h((string) $r['evidenz']) . '</td><td>' . h((string) $r['wert']) . '</td><td>' . h((string) $r['bedienbar']) . '</td><td>' . h((string) $r['schritt']) . '</td></tr>';
    }
    if ($register === []) {
        $html .= '<tr><td colspan="7">Noch keine Einträge im Zeitraum.</td></tr>';
    }
    $html .= '</table></div>';

    $html .= '<h2>Übergabe-Einstieg im Vergleich</h2><p class="muted">Vergleichsgruppe: alle übrigen Anfragen im selben Zeitraum. Keine Zufallszuteilung – Unterschiede können an der Art der Anfragen liegen.</p>'
        . '<div class="scroll"><table><tr><th>Gruppe</th><th>Anfragen</th><th>Vollständig</th><th>Mit Ergebnis</th><th>Rückfrage nötig</th><th>Aufträge</th><th>Ø Zusatz/Ausbau</th></tr>';
    foreach (['uebergabe' => 'Übergabe-Einstieg', 'andere' => 'Andere Anfragen'] as $k => $label) {
        $v = $agg['vorhaben'][$k] ?? ['n' => 0, 'vollstaendig' => 0, 'mitErgebnis' => 0, 'rueckfrage' => 0, 'auftrag' => 0, 'zusatzSumme' => 0];
        $html .= '<tr><td>' . h($label) . '</td><td>' . $v['n'] . '</td><td>' . $pct($v['vollstaendig'], $v['n']) . '</td><td>' . $v['mitErgebnis']
            . '</td><td>' . $pct($v['rueckfrage'], $v['mitErgebnis']) . '</td><td>' . $pct($v['auftrag'], $v['mitErgebnis'])
            . '</td><td>' . ($v['n'] > 0 ? number_format($v['zusatzSumme'] / $v['n'], 1, ',', '') : '–') . '</td></tr>';
    }
    $html .= '</table></div>';

    $section = static function (string $title, array $bucket, array $labels) use ($pct): string {
        $out = '<h2>' . h($title) . '</h2><div class="scroll"><table><tr><th>Thema</th><th>Anfragen</th><th>Mit Ergebnis</th><th>Auftragsquote</th><th>Häufigste Wertklasse</th></tr>';
        foreach (array_slice($bucket, 0, 25, true) as $key => $b) {
            $out .= '<tr><td>' . h((string) ($labels[$key] ?? $key)) . '</td><td>' . $b['n'] . '</td><td>' . $b['ergebnis'] . '</td><td>' . $pct($b['auftrag'], $b['ergebnis']) . '</td><td>' . h(sh24_top_wert($b)) . '</td></tr>';
        }
        return $out . ($bucket === [] ? '<tr><td colspan="5">–</td></tr>' : '') . '</table></div>';
    };
    $anfLabels = array_map(static fn($a) => $a[0], SH24_ANFORDERUNGEN);
    $html .= $section('Leistungen', $agg['leistung'], []);
    $html .= $section('Kombinationen (Leistung + Zusatzleistung)', $agg['kombination'], []);
    $html .= $section('Anforderungen bis zur Übergabe', $agg['anforderung'], $anfLabels);
    $html .= $section('Vor der Anfrage offen', $agg['offen'], SH24_OFFEN);
    $html .= $section('Kanal', $agg['kanal'], []);

    $simple = static function (string $title, array $counts, array $labels): string {
        $out = '<h2>' . h($title) . '</h2><table><tr><th>Wert</th><th>Anzahl</th></tr>';
        foreach ($counts as $k => $c) {
            $out .= '<tr><td>' . h((string) ($labels[$k] ?? $k)) . '</td><td>' . (int) $c . '</td></tr>';
        }
        return $out . ($counts === [] ? '<tr><td colspan="2">–</td></tr>' : '') . '</table>';
    };
    $html .= $simple('Absagegründe', $agg['grund'], SH24_GRUND);
    $html .= $simple('Versorgungslücken (Stichwort)', $agg['luecke'], []);
    $html .= $simple('Nötige Rückfragen je Leistung', $agg['rueckfrage'], []);

    sh24_page('Nachfrageverzeichnis', $html);
}

/* ------------------------------------------------------------------ */
/* Ansicht: Anfragen mit Ergebnis-Erfassung                            */
/* ------------------------------------------------------------------ */

$recent = array_reverse(array_values(array_filter($entries, static fn($e) => isset($e['ref']) && (string) ($e['tag'] ?? '') >= $from)));
$open = count(array_filter($recent, static fn($e) => !isset($latest[(string) $e['ref']])));

$html = $nav . '<h1>Anfragen und Ergebnisse</h1>';
if (isset($_GET['gespeichert'])) {
    $html .= '<p class="ok">Ergebnis für ' . h((string) $_GET['gespeichert']) . ' gespeichert.</p>';
}
$html .= '<p class="muted">' . count($recent) . ' Anfragen in ' . $days . ' Tagen, davon ' . $open . ' ohne Ergebnis. '
    . 'Kontaktdaten stehen nur in der Anfrage-Mail; die Referenz verbindet beides. Freitext „Lücke“: nur ein Stichwort zur Leistung, keine Namen.</p>';

$anfLabels = array_map(static fn($a) => $a[0], SH24_ANFORDERUNGEN);
$html .= '<div class="scroll"><table><tr><th>Referenz / Tag</th><th>Anfrage</th><th>Signale</th><th>Ergebnis</th></tr>';
foreach (array_slice($recent, 0, 200) as $e) {
    $ref = (string) $e['ref'];
    $o = $latest[$ref] ?? null;
    $html .= '<tr id="' . h($ref) . '"><td><strong>' . h($ref) . '</strong><br>' . h((string) $e['tag']) . '<br><span class="muted">' . h((string) ($e['kanal'] ?? '')) . '</span></td>'
        . '<td>' . h((string) $e['leistung']) . ($e['vorhaben'] === 'uebergabe' ? ' <span class="tag">Übergabe</span>' : '')
        . '<br>' . h((string) $e['umfang']) . ' · ' . h((string) $e['anlass']) . '<br><span class="muted">Vorlauf ' . h((string) $e['vorlauf']) . ' · Fotos ' . (int) $e['fotos'] . ' · Beschreibung ' . h((string) $e['beschreibung']) . '</span></td>'
        . '<td>' . sh24_tags((array) $e['zusatz']) . sh24_tags((array) $e['anforderungen'], $anfLabels) . (((array) $e['offen']) !== [] ? '<br><span class="muted">Offen:</span> ' . sh24_tags((array) $e['offen'], SH24_OFFEN) : '') . '</td>'
        . '<td><form method="post" action="betrieb.php"><input type="hidden" name="aktion" value="ergebnis"><input type="hidden" name="csrf" value="' . h($csrf) . '"><input type="hidden" name="ref" value="' . h($ref) . '">'
        . sh24_select('status', SH24_STATUS, (string) ($o['status'] ?? 'in-klaerung')) . ' ' . sh24_select('grund', SH24_GRUND, (string) ($o['grund'] ?? ''))
        . ' ' . sh24_select('wert', SH24_WERT, (string) ($o['wert'] ?? '')) . '<fieldset><span class="muted">Rückfrage nötig zu:</span> ';
    foreach (SH24_RUECKFRAGE as $k => $label) {
        $checked = in_array($k, (array) ($o['rueckfrage'] ?? []), true) ? ' checked' : '';
        $html .= '<label class="cb"><input type="checkbox" name="rueckfrage[]" value="' . h($k) . '"' . $checked . '> ' . h($label) . '</label>';
    }
    $html .= '</fieldset><input type="text" name="luecke" maxlength="40" placeholder="Lücke, z. B. Fliesen" value="' . h((string) ($o['luecke'] ?? '')) . '"> '
        . '<button type="submit">Speichern</button>' . ($o !== null ? ' <span class="muted">zuletzt ' . h(substr((string) $o['ts'], 0, 10)) . '</span>' : '') . '</form></td></tr>';
}
if ($recent === []) {
    $html .= '<tr><td colspan="4">Noch keine Anfragen im Register. Einträge entstehen ab dem Deployment dieser Funktion.</td></tr>';
}
$html .= '</table></div>';

sh24_page('Anfragen', $html);
