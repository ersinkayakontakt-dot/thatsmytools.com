<?php
/**
 * SCHNELLHELFER24 – EREIGNIS-ENDPUNKT
 * ===================================
 *
 * Nimmt datensparsame Conversion- und Performance-Ereignisse entgegen.
 * Gegenstück zu src/components/Analytics.astro.
 *
 * WOZU ÜBERHAUPT
 * Ohne Messung lässt sich nicht beantworten, welche Seite Anfragen
 * erzeugt, wo Menschen im Formular abbrechen und welche Seiten Besuch
 * bekommen, aber nichts auslösen. Das sind die Fragen, an denen sich
 * entscheidet, wo Arbeit sich lohnt.
 *
 * WAS HIER NICHT ANKOMMT – und zwar bauartbedingt, nicht durch Disziplin:
 *   - keine IP-Adresse, auch nicht gekürzt
 *   - kein Cookie, keine Kennung über Sitzungen hinweg
 *   - kein Fingerprint, keine Werbe-ID
 *   - keine Formularinhalte, keine Namen, Telefonnummern, E-Mails
 *   - keine hochgeladenen Bilder
 *   - keine vollständigen Query-Strings
 *   - kein User-Agent im Klartext
 *
 * Erreicht wird das über eine ALLOWLIST: Nur ausdrücklich aufgeführte
 * Ereignisnamen und Felder werden gespeichert, alles andere fällt weg.
 * Eine Blocklist wäre der falsche Weg – sie vergisst, was sie nicht kennt,
 * und ein neues Feld im Frontend landet stillschweigend in der Ablage.
 *
 * DAS TAGESGEHEIMNIS
 * Zum Zählen von Sitzungen und für das Rate Limiting wird ein Hash aus
 * IP-Adresse und einem Geheimnis gebildet, das täglich neu erzeugt und
 * beim Wechsel verworfen wird. Nach Tagesende lässt sich kein Ereignis
 * mehr einer Adresse zuordnen – auch nicht mit dem Serverzugang. Die
 * IP-Adresse selbst wird nie geschrieben.
 *
 * RECHTLICHER HINWEIS
 * Technische Datensparsamkeit ist NICHT automatisch dasselbe wie
 * Einwilligungsfreiheit. Ob diese Messung nach § 25 TDDDG und DSGVO ohne
 * Einwilligung zulässig ist, muss anwaltlich geprüft werden – die
 * Bewertung hängt unter anderem daran, dass hier nichts im Endgerät
 * gespeichert oder ausgelesen wird. Siehe CONTENT-TODO.md.
 *
 * EINRICHTUNG
 *   1. config.local.php neben dieser Datei anlegen (Vorlage:
 *      config.example.php) und `eventsEnabled => true` setzen.
 *   2. Verzeichnis _storage/ beschreibbar machen (0700 genügt).
 *   3. Eine Testanfrage senden und prüfen, dass in der JSONL weder IP
 *      noch Formularinhalte stehen.
 *
 * Solange `eventsEnabled` nicht ausdrücklich true ist, verwirft dieser
 * Endpunkt jede Anfrage. Ein Messsystem darf nicht durch bloßes
 * Hochladen einer Datei aktiv werden.
 *
 * VORAUSSETZUNG: PHP 8.0 oder neuer.
 */

declare(strict_types=1);

/* ------------------------------------------------------------------ */
/* Konfiguration                                                       */
/* ------------------------------------------------------------------ */

$config = [
    // Muss in config.local.php ausdrücklich aktiviert werden.
    'eventsEnabled'  => false,

    'siteUrl'        => 'https://schnellhelfer24.de',
    'storageDir'     => __DIR__ . '/_storage',

    // Aufbewahrung in Tagen. Muss zur Datenschutzerklärung passen.
    // Kurz halten: Für die Auswertung genügen Wochen, nicht Jahre.
    'retentionDays'  => 90,

    // Rate Limiting je Tagesgeheimnis-Hash.
    'rateWindow'     => 600,   // Sekunden
    'rateMax'        => 120,   // Ereignisse je Fenster

    // Größenbegrenzung der Anfrage.
    'maxBodyBytes'   => 8192,

    // Obergrenze je Tagesdatei. Verhindert, dass ein Fehler oder ein
    // Angriff die Festplatte füllt.
    'maxEventsPerDay' => 200000,

    // Do Not Track und Global Privacy Control beachten.
    'respectDnt'     => true,
];

if (is_file(__DIR__ . '/config.local.php')) {
    $local = require __DIR__ . '/config.local.php';
    if (is_array($local)) {
        $config = array_merge($config, $local);
    }
}

/* ------------------------------------------------------------------ */
/* Allowlists                                                          */
/* ------------------------------------------------------------------ */

/**
 * Erlaubte Ereignisnamen. Alles andere wird verworfen.
 *
 * Diese Liste ist an den Namen ausgerichtet, die der Code TATSÄCHLICH
 * sendet – nicht an Wunschnamen. `npm run seo:events` vergleicht sie mit
 * allen `data-track`-Attributen, `track`-Eigenschaften und
 * `sh24.track()`-Aufrufen in src/ und meldet jede Abweichung.
 *
 * Diese Prüfung gibt es, weil die Namen bereits einmal auseinandergelaufen
 * sind: Das Anfrageformular sendet seit jeher `estimate_started`, während
 * eine neu geschriebene Allowlist `form_start` erwartete. Der Endpunkt
 * hätte jedes Formularereignis stillschweigend verworfen – ohne Fehler,
 * ohne Meldung, nur mit fehlenden Daten in der Auswertung.
 */
const ALLOWED_EVENTS = [
    // Seitenaufruf und Technik
    'page_view',
    'web_vital',

    // Kontaktaufnahme
    'phone_click',
    'whatsapp_click',
    'callback_request',
    'partner_request',
    'estimate_cta_click',

    // Anfrageformular (AufwandCheck.astro)
    'estimate_started',
    'estimate_step_completed',
    'estimate_abandoned',
    'photo_uploaded',
    'lead_form_submitted',
    'lead_confirmed',

    // Interne Navigation und Empfehlungsmodule
    'related_service_click',
    'related_guide_click',
    'related_question_click',
    'location_click',
    'case_study_opened',
    'company_link_click',
    'cost_guide_click',
    'cost_hub_click',
    'guide_download',

    // Klick auf den Bewertungslink von /bewerten/. Diese Seite ist der
    // kurze, aussprechbare Weg für Rechnungen und QR-Codes; ob er benutzt
    // wird, lässt sich sonst nicht feststellen.
    'review_click',
];

/** Erlaubte Gerätekategorien – bewusst grob, kein Modell, keine Version. */
const ALLOWED_DEVICES = ['mobile', 'tablet', 'desktop', 'unbekannt'];

/** Erlaubte Kanäle. */
const ALLOWED_CHANNELS = ['organic', 'paid', 'ai', 'referral', 'direct'];

/** Erlaubte Web-Vitals-Kennzahlen. */
const ALLOWED_VITALS = ['LCP', 'INP', 'CLS', 'TTFB', 'FCP'];

/* ------------------------------------------------------------------ */
/* Hilfsfunktionen                                                     */
/* ------------------------------------------------------------------ */

/**
 * Antwortet immer gleich und beendet.
 *
 * Immer 204, egal ob angenommen, verworfen oder abgelehnt. Ein Endpunkt,
 * der unterschiedlich antwortet, verrät seine Regeln – und lässt sich
 * damit gezielt umgehen. Details stehen ausschließlich im Serverlog.
 */
function done(): void
{
    http_response_code(204);
    header('Cache-Control: no-store');
    exit;
}

/** Entfernt Steuerzeichen und begrenzt die Länge. */
function scrub(?string $value, int $maxLength = 200): string
{
    if ($value === null) {
        return '';
    }
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    $value = trim($value);
    return mb_strlen($value) > $maxLength ? mb_substr($value, 0, $maxLength) : $value;
}

/**
 * Nur der Pfad, nie der Query-String.
 *
 * Query-Strings tragen oft personenbezogene Daten – eine E-Mail in einem
 * Rücksprung-Parameter, ein Name aus einem Formular. Sie werden hier
 * grundsätzlich abgeschnitten, nicht gefiltert.
 */
function pathOnly(string $value): string
{
    $path = parse_url($value, PHP_URL_PATH);
    if (!is_string($path) || $path === '') {
        return '/';
    }
    return scrub($path, 160);
}

/**
 * Tagesgeheimnis. Wird einmal je Kalendertag erzeugt und ersetzt das
 * vorherige. Ältere Dateien werden gelöscht – danach ist die Zuordnung
 * eines Hashes zu einer IP-Adresse auch mit Serverzugang unmöglich.
 */
function dailySecret(string $storage): string
{
    $dir = $storage . '/salt';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return '';
    }

    $today = gmdate('Y-m-d');
    $file  = $dir . '/' . $today . '.key';

    if (is_file($file)) {
        $secret = @file_get_contents($file);
        if (is_string($secret) && $secret !== '') {
            return $secret;
        }
    }

    $secret = bin2hex(random_bytes(32));
    @file_put_contents($file, $secret, LOCK_EX);
    @chmod($file, 0600);

    // Ältere Tagesgeheimnisse verwerfen.
    foreach (glob($dir . '/*.key') ?: [] as $old) {
        if (basename($old) !== $today . '.key') {
            @unlink($old);
        }
    }

    return $secret;
}

/**
 * Pseudonym für Rate Limiting und Sitzungszählung.
 * Ohne Tagesgeheimnis gibt es kein Pseudonym – dann wird nur gezählt,
 * nicht begrenzt. Lieber keine Begrenzung als eine gespeicherte IP.
 */
function visitorHash(string $secret): string
{
    if ($secret === '') {
        return '';
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return substr(hash('sha256', $ip . '|' . $secret), 0, 16);
}

/* ------------------------------------------------------------------ */
/* 1. Grundprüfungen                                                   */
/* ------------------------------------------------------------------ */

header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: same-origin');

if (!$config['eventsEnabled']) {
    done();
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    done();
}

/**
 * Do Not Track und Global Privacy Control.
 * Das Frontend sendet in diesem Fall ohnehin nichts; die Prüfung hier ist
 * die zweite Ebene für den Fall, dass jemand direkt anfragt.
 */
if ($config['respectDnt']) {
    if (($_SERVER['HTTP_DNT'] ?? '') === '1' || ($_SERVER['HTTP_SEC_GPC'] ?? '') === '1') {
        done();
    }
}

/**
 * Nur von der eigenen Website. `sendBeacon` sendet einen Origin-Header;
 * fehlt er, wird abgelehnt. Das hält einfache Fremdeinsendungen fern.
 * Ein vollständiger Schutz ist es nicht – siehe Restrisiko in SEO-SYSTEM.md.
 */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $origin !== $config['siteUrl']) {
    error_log('[schnellhelfer24] Ereignis von fremder Herkunft abgewiesen: ' . $origin);
    done();
}

$raw = file_get_contents('php://input');
if (!is_string($raw) || $raw === '' || strlen($raw) > $config['maxBodyBytes']) {
    done();
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
    done();
}

/* Mehrere Ereignisse je Anfrage sind erlaubt – sendBeacon bündelt beim
   Verlassen der Seite. */
$incoming = isset($payload['events']) && is_array($payload['events'])
    ? $payload['events']
    : [$payload];

if (count($incoming) > 30) {
    $incoming = array_slice($incoming, 0, 30);
}

/* ------------------------------------------------------------------ */
/* 2. Ablage vorbereiten                                               */
/* ------------------------------------------------------------------ */

$storage = $config['storageDir'];
$eventsDir = $storage . '/events';

if (!is_dir($eventsDir) && !@mkdir($eventsDir, 0700, true) && !is_dir($eventsDir)) {
    error_log('[schnellhelfer24] Ereignisablage nicht beschreibbar: ' . $eventsDir);
    done();
}

$secret  = dailySecret($storage);
$visitor = visitorHash($secret);

/* ------------------------------------------------------------------ */
/* 3. Rate Limiting                                                    */
/* ------------------------------------------------------------------ */

if ($visitor !== '') {
    $rateDir = $storage . '/rate-events';
    if (is_dir($rateDir) || @mkdir($rateDir, 0700, true)) {
        $rateFile = $rateDir . '/' . $visitor . '.json';
        $now = time();
        $hits = [];
        if (is_file($rateFile)) {
            $decoded = json_decode((string) @file_get_contents($rateFile), true);
            if (is_array($decoded)) {
                $hits = array_values(array_filter(
                    $decoded,
                    static fn ($t) => is_int($t) && $t > $now - $config['rateWindow'],
                ));
            }
        }
        if (count($hits) >= $config['rateMax']) {
            done();
        }
        $hits[] = $now;
        @file_put_contents($rateFile, json_encode($hits), LOCK_EX);
        @chmod($rateFile, 0600);
    }
}

/* ------------------------------------------------------------------ */
/* 4. Ereignisse prüfen und aufbereiten                                */
/* ------------------------------------------------------------------ */

$accepted = [];
$nowIso   = gmdate('c');

foreach ($incoming as $event) {
    if (!is_array($event)) {
        continue;
    }

    $name = scrub((string) ($event['event'] ?? ''), 40);
    if (!in_array($name, ALLOWED_EVENTS, true)) {
        continue;
    }

    /**
     * Aufgebaut wird ein NEUER Datensatz aus erlaubten Feldern – die
     * eingehende Struktur wird nicht bereinigt und übernommen. Damit kann
     * kein unbekanntes Feld durchrutschen, auch nicht versehentlich.
     */
    $record = [
        'ts'      => $nowIso,
        'event'   => $name,
        'page'    => pathOnly((string) ($event['page'] ?? '/')),
        'visitor' => $visitor,
    ];

    $device = strtolower(scrub((string) ($event['device'] ?? 'unbekannt'), 12));
    $record['device'] = in_array($device, ALLOWED_DEVICES, true) ? $device : 'unbekannt';

    $source = is_array($event['source'] ?? null) ? $event['source'] : [];

    $channel = strtolower(scrub((string) ($source['channel'] ?? 'direct'), 12));
    $record['channel'] = in_array($channel, ALLOWED_CHANNELS, true) ? $channel : 'direct';

    // Nur der Host des Verweises, nie die vollständige URL: Eine fremde
    // URL kann personenbezogene Parameter enthalten.
    $referrerHost = scrub((string) ($source['referrerHost'] ?? ''), 80);
    if ($referrerHost !== '' && preg_match('/^[a-z0-9.\-]+$/i', $referrerHost)) {
        $record['referrerHost'] = strtolower($referrerHost);
    }

    // UTM-Werte sind Kampagnenkennungen und keine Personendaten – trotzdem
    // gekürzt und von Sonderzeichen befreit.
    foreach (['source', 'medium', 'campaign'] as $utm) {
        $value = scrub((string) ($source[$utm] ?? ''), 60);
        if ($value !== '' && preg_match('/^[a-z0-9_.\-]+$/i', $value)) {
            $record['utm_' . $utm] = strtolower($value);
        }
    }

    $landing = scrub((string) ($source['landing'] ?? ''), 160);
    if ($landing !== '') {
        $record['landing'] = pathOnly($landing);
    }

    /* Ereignisabhängige Zusatzfelder – ebenfalls streng begrenzt. */
    $detail = is_array($event['detail'] ?? null) ? $event['detail'] : [];

    if ($name === 'web_vital') {
        $metric = strtoupper(scrub((string) ($detail['metric'] ?? ''), 6));
        if (!in_array($metric, ALLOWED_VITALS, true)) {
            continue;
        }
        $value = $detail['value'] ?? null;
        if (!is_numeric($value)) {
            continue;
        }
        $record['metric'] = $metric;
        // Auf ganze Zahlen runden (CLS auf drei Nachkommastellen): Ein
        // hochaufgelöster Messwert ist ein Fingerprint-Merkmal.
        $record['value'] = $metric === 'CLS'
            ? round((float) $value, 3)
            : (int) round((float) $value);
        $rating = strtolower(scrub((string) ($detail['rating'] ?? ''), 12));
        if (in_array($rating, ['good', 'needs-improvement', 'poor'], true)) {
            $record['rating'] = $rating;
        }
    } else {
        // `location` sagt, WO auf der Seite geklickt wurde (Kopfbereich,
        // Hero, Fußbereich). Kein freier Text, sondern ein kurzer
        // Bezeichner aus dem eigenen Markup.
        $location = scrub((string) ($detail['location'] ?? ''), 40);
        if ($location !== '' && preg_match('/^[a-z0-9_:\-]+$/i', $location)) {
            $record['location'] = $location;
        }

        // Formularschritt als Zahl, nicht als Inhalt.
        // `lastStep` kommt vom Abbruch-Ereignis und meint dasselbe – beide
        // landen im selben Feld, damit die Auswertung nur einen Namen kennt.
        foreach (['step', 'lastStep'] as $stepField) {
            if (isset($detail[$stepField]) && is_numeric($detail[$stepField])) {
                $record['step'] = min(20, max(0, (int) $detail[$stepField]));
                break;
            }
        }

        // Anzahl ausgewählter Fotos – niemals Dateinamen oder Inhalte.
        if (isset($detail['count']) && is_numeric($detail['count'])) {
            $record['count'] = min(99, max(0, (int) $detail['count']));
        }

        /**
         * Angefragte Leistung. Das ist die Angabe, mit der sich
         * beantworten lässt, welche Leistung tatsächlich Aufträge
         * erzeugt – die zentrale Frage des Messsystems.
         *
         * Der Wert stammt aus einem Auswahlfeld. Damit hier trotzdem
         * niemals ein freier Text landet, wird er gegen ein enges Muster
         * geprüft: nur Buchstaben, Leerzeichen und Bindestriche.
         *
         * Eine E-Mail-Adresse (@), eine Telefonnummer (Ziffern), eine
         * Hausnummer oder ein Name mit Ziffern scheitern daran. Das ist
         * absichtlich strenger als nötig: Ein verlorenes Auswahlfeld ist
         * ein kleiner Verlust, eine gespeicherte Telefonnummer ein
         * Datenschutzvorfall.
         */
        $service = scrub((string) ($detail['leistung'] ?? ''), 40);
        if ($service !== '' && preg_match('/^[a-zA-ZäöüÄÖÜß][a-zA-ZäöüÄÖÜß \-]{1,39}$/u', $service)) {
            $record['leistung'] = $service;
        }
    }

    $accepted[] = $record;
}

if (!$accepted) {
    done();
}

/* ------------------------------------------------------------------ */
/* 5. Schreiben                                                        */
/* ------------------------------------------------------------------ */

$file = $eventsDir . '/' . gmdate('Y-m-d') . '.jsonl';

/**
 * Obergrenze je Tagesdatei. Ohne sie könnte ein Fehler im Frontend oder
 * ein Angriff die Festplatte füllen und damit auch den Anfrage-Endpunkt
 * lahmlegen – der teilt sich dasselbe Verzeichnis.
 */
if (is_file($file) && filesize($file) > $config['maxEventsPerDay'] * 260) {
    error_log('[schnellhelfer24] Tagesobergrenze für Ereignisse erreicht.');
    done();
}

$lines = '';
foreach ($accepted as $record) {
    $lines .= json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
}

// LOCK_EX, weil mehrere Anfragen gleichzeitig anhängen können. Ohne
// Sperre entstehen abgeschnittene Zeilen mitten in der Datei.
@file_put_contents($file, $lines, FILE_APPEND | LOCK_EX);
@chmod($file, 0600);

/* ------------------------------------------------------------------ */
/* 6. Aufräumen                                                        */
/* ------------------------------------------------------------------ */

/**
 * Gelegentlich alte Dateien löschen – nicht bei jeder Anfrage, das wäre
 * unnötige Last. Bei etwa jedem hundertsten Aufruf genügt vollkommen.
 */
if (random_int(1, 100) === 1) {
    $cutoff = time() - $config['retentionDays'] * 86400;
    foreach (glob($eventsDir . '/*.jsonl') ?: [] as $old) {
        if (@filemtime($old) < $cutoff) {
            @unlink($old);
        }
    }
    // Rate-Limit-Dateien sind nach dem Zeitfenster wertlos.
    foreach (glob($storage . '/rate-events/*.json') ?: [] as $old) {
        if (@filemtime($old) < time() - $config['rateWindow'] * 2) {
            @unlink($old);
        }
    }
}

done();
