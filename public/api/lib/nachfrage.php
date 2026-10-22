<?php
/**
 * NACHFRAGEREGISTER (GROW-2026-01)
 * ================================
 *
 * Macht sichtbar, welche Anliegen tatsächlich ankommen, welche zusammen
 * angefragt werden, welche wir nicht bedienen und was vor der Anfrage
 * unklar war. Methodik, Betrieb und Entscheidungsregeln:
 * docs/NACHFRAGE-SYSTEM.md.
 *
 * ZWEI DATEIEN, BEIDE OHNE KONTAKTDATEN
 *   nachfrage/register-YYYY-MM.jsonl  ein Eintrag je angenommener Anfrage,
 *                                     geschrieben von anfrage.php
 *   nachfrage/ergebnisse.jsonl        Ergebnis je Referenz, gesetzt im
 *                                     Betriebsbereich (betrieb.php)
 *
 * Bauartbedingt NICHT im Register: Name, Telefon, E-Mail, Ort, Freitext,
 * genaues Datum des Wunschtermins, vollständige PLZ, Fotos, IP. Der Eintrag
 * wird aus einer Allowlist neu aufgebaut, nicht aus der Anfrage gefiltert.
 *
 * Die Referenz verbindet Register und Anfrage, solange die Anfrage
 * aufbewahrt wird. Nach SH24_REF_TAGE wird sie entfernt und das Ergebnis
 * in den Eintrag übernommen – danach ist das Register anonym.
 *
 * CROSS-LAYER: SH24_ANFORDERUNGEN und SH24_OFFEN spiegeln
 * src/data/requestSignals.ts. `npm run audit:demand:selftest` prüft das.
 */

declare(strict_types=1);

const SH24_REF_TAGE = 180;

/** Schlüssel => [Beschriftung, Zuständigkeit]. Spiegelt handoverItems. */
const SH24_ANFORDERUNGEN = [
    'geraeumt'    => ['Alles geräumt, auch Keller und Nebenräume', 'eigen'],
    'besenrein'   => ['Besenrein', 'eigen'],
    'einbauten'   => ['Einbauten oder Küche zurückbauen', 'eigen'],
    'duebel'      => ['Dübellöcher schließen', 'eigen'],
    'boden-raus'  => ['Teppich oder alten Boden entfernen', 'eigen'],
    'boden-neu'   => ['Neuen Bodenbelag verlegen', 'eigen'],
    'reinigung'   => ['Endreinigung', 'eigen'],
    'streichen'   => ['Wände oder Decken streichen', 'fachbetrieb'],
    'tapeten'     => ['Tapeten entfernen oder neu tapezieren', 'fachbetrieb'],
    'reparaturen' => ['Reparaturen an Fenstern, Türen, Sanitär oder Elektrik', 'nicht'],
    'unklar'      => ['Noch unklar – Vertrag oder Protokoll liegt vor', 'eigen'],
];

/** Schlüssel => Beschriftung. Spiegelt openQuestions. */
const SH24_OFFEN = [
    'kosten'       => 'Mit welchen Kosten ich rechnen muss',
    'machbar'      => 'Ob Sie das überhaupt übernehmen',
    'termin'       => 'Ob es bis zu meinem Termin klappt',
    'gegenstaende' => 'Was mit Möbeln und Gegenständen passiert',
    'vorbereitung' => 'Was ich vorher selbst erledigen muss',
    'vermieter'    => 'Was der Vermieter oder die Verwaltung verlangen darf',
    'ablauf'       => 'Wie der Ablauf am Einsatztag aussieht',
];

const SH24_ZUSTAENDIG = [
    'eigen'       => 'Eigene Leistung',
    'fachbetrieb' => 'Mit Fachbetrieb abstimmen',
    'nicht'       => 'Nicht im Angebot',
];

/* Ergebnis-Erfassung im Betriebsbereich. Feste Werte, damit gezählt werden kann. */
const SH24_STATUS = [
    'in-klaerung'    => 'In Klärung',
    'angebot'        => 'Angebot erstellt',
    'auftrag'        => 'Auftrag erhalten',
    'abgesagt-wir'   => 'Von uns abgesagt',
    'abgesagt-kunde' => 'Vom Kunden abgesagt',
    'keine-reaktion' => 'Keine Reaktion',
];
const SH24_GRUND = [
    ''                 => '–',
    'gebiet'           => 'Außerhalb des Einsatzgebiets',
    'kapazitaet'       => 'Kein Termin/keine Kapazität frei',
    'nicht-im-angebot' => 'Leistung nicht im Angebot',
    'fachbetrieb-fehlt'=> 'Kein passender Fachbetrieb',
    'zu-klein'         => 'Auftrag zu klein für die Anfahrt',
    'preis'            => 'Kunde: Preis',
    'anderer-anbieter' => 'Kunde: anderer Anbieter',
    'verschoben'       => 'Kunde: Vorhaben verschoben',
    'nicht-erreichbar' => 'Kunde nicht erreichbar',
    'sonstiges'        => 'Sonstiges',
];
const SH24_WERT = [
    ''           => 'unbekannt',
    'unter-500'  => 'unter 500 €',
    '500-1500'   => '500–1.500 €',
    '1500-5000'  => '1.500–5.000 €',
    'ueber-5000' => 'über 5.000 €',
];
const SH24_RUECKFRAGE = [
    'umfang'        => 'Umfang/Menge',
    'zugang'        => 'Zugang/Etage/Parken',
    'termin'        => 'Termin',
    'masse'         => 'Maße/Fläche',
    'fotos'         => 'Fotos nachgefordert',
    'zustaendigkeit'=> 'Zuständigkeit/Gewerk',
    'sonstiges'     => 'Sonstiges',
];

/** Zusatzleistungen des Formulars. Unbekanntes wird als 'sonstige' gezählt. */
const SH24_ZUSATZ_BEKANNT = [
    'Verpackung', 'Möbelabbau', 'Möbelaufbau', 'Rückbau von Einbauten',
    'Neuen Bodenbelag verlegen', 'Küchenmontage', 'Einlagerung', 'Reinigung',
    'Fotodokumentation', 'Schlüsselübergabe',
];

/* ------------------------------------------------------------------ */
/* Eingaben aus dem Formular                                           */
/* ------------------------------------------------------------------ */

/**
 * Nimmt ein Array aus $_POST und behält nur bekannte Schlüssel, ohne
 * Duplikate, in der Reihenfolge der Allowlist.
 *
 * @param array<string, mixed> $allowed
 * @return list<string>
 */
function sh24_pick_keys(mixed $raw, array $allowed): array
{
    if (!is_array($raw)) {
        return [];
    }
    $given = [];
    foreach (array_slice($raw, 0, 20) as $value) {
        if (is_string($value)) {
            $given[$value] = true;
        }
    }
    return array_values(array_filter(array_keys($allowed), static fn($k) => isset($given[$k])));
}

/** Tage zwischen heute und Wunschtermin, grob eingeteilt. Das Datum selbst wird nicht gespeichert. */
function sh24_vorlauf_bucket(string $stichtag, int $now): string
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $stichtag)) {
        return 'kein';
    }
    $ts = strtotime($stichtag . ' 12:00:00');
    if ($ts === false) {
        return 'kein';
    }
    $days = (int) floor(($ts - $now) / 86400);
    if ($days < 0) {
        return 'vergangen';
    }
    if ($days < 7) {
        return '0-6';
    }
    if ($days < 14) {
        return '7-13';
    }
    if ($days < 30) {
        return '14-29';
    }
    return '30+';
}

function sh24_text_bucket(string $text): string
{
    $n = mb_strlen(trim($text));
    if ($n === 0) {
        return 'leer';
    }
    if ($n < 100) {
        return 'kurz';
    }
    if ($n < 500) {
        return 'mittel';
    }
    return 'lang';
}

/**
 * Baut den Registereintrag NEU aus erlaubten Feldern.
 *
 * @param array<string, string> $fields Bereinigte Formularfelder aus anfrage.php
 * @param list<string> $zusatz
 * @param list<string> $neben
 * @param list<string> $anforderungen
 * @param list<string> $offen
 * @return array<string, mixed>
 */
function sh24_ledger_entry(array $fields, array $zusatz, array $neben, array $anforderungen, array $offen, int $fotos, string $ref, int $now): array
{
    $quelle = (string) ($fields['quelle'] ?? '');
    $kanal = strtolower(trim(explode('|', $quelle)[0]));
    if (!preg_match('/^[a-z]{1,12}$/', $kanal)) {
        $kanal = 'unbekannt';
    }
    $plz = (string) ($fields['plz'] ?? '');

    return [
        'v'             => 1,
        'ref'           => $ref,
        'tag'           => date('Y-m-d', $now),
        'leistung'      => mb_substr((string) ($fields['leistung'] ?? ''), 0, 80),
        'umfang'        => mb_substr((string) ($fields['umfang'] ?? ''), 0, 40),
        'anlass'        => mb_substr((string) ($fields['anlass'] ?? ''), 0, 60),
        'objektart'     => mb_substr((string) ($fields['objektart'] ?? ''), 0, 60),
        'zeitraum'      => mb_substr((string) ($fields['zeitraum'] ?? ''), 0, 60),
        'vorlauf'       => sh24_vorlauf_bucket((string) ($fields['stichtag'] ?? ''), $now),
        'gebiet'        => (string) ($fields['gebiet'] ?? ''),
        // Nur die ersten drei Ziffern: grobe Region, keine Adresse.
        'plz3'          => preg_match('/^\d{5}$/', $plz) ? substr($plz, 0, 3) : '',
        'kanal'         => $kanal,
        'vorhaben'      => (string) ($fields['vorhaben'] ?? ''),
        'zusatz'        => array_values(array_unique(array_map(
            static fn($z) => in_array($z, SH24_ZUSATZ_BEKANNT, true) ? $z : 'sonstige',
            $zusatz
        ))),
        'nebenraeume'   => count($neben),
        'anforderungen' => $anforderungen,
        'offen'         => $offen,
        'fotos'         => max(0, $fotos),
        'flaeche'       => trim((string) ($fields['flaeche'] ?? '')) !== '',
        'beschreibung'  => sh24_text_bucket((string) ($fields['beschreibung'] ?? '')),
    ];
}

function sh24_nachfrage_dir(string $storage): string
{
    return rtrim($storage, '/') . '/nachfrage';
}

/** Hängt einen Eintrag an. Liefert false statt zu werfen: Das Register darf keine Anfrage verhindern. */
function sh24_ledger_append(string $storage, array $entry): bool
{
    $dir = sh24_nachfrage_dir($storage);
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false;
    }
    $line = json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    if ($line === false) {
        return false;
    }
    $file = $dir . '/register-' . substr((string) $entry['tag'], 0, 7) . '.jsonl';
    $ok = @file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX) !== false;
    @chmod($file, 0600);
    return $ok;
}

/** @return list<array<string, mixed>> */
function sh24_read_jsonl(string $file): array
{
    if (!is_file($file)) {
        return [];
    }
    $out = [];
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $row = json_decode($line, true);
        if (is_array($row)) {
            $out[] = $row;
        }
    }
    return $out;
}

/** @return list<array<string, mixed>> Alle Registereinträge, älteste zuerst. */
function sh24_ledger_read(string $storage): array
{
    $files = glob(sh24_nachfrage_dir($storage) . '/register-*.jsonl') ?: [];
    sort($files);
    $all = [];
    foreach ($files as $file) {
        foreach (sh24_read_jsonl($file) as $row) {
            $all[] = $row;
        }
    }
    return $all;
}

/* ------------------------------------------------------------------ */
/* Ergebnisse                                                          */
/* ------------------------------------------------------------------ */

/**
 * Prüft ein Ergebnis aus dem Betriebsbereich und baut es neu auf.
 *
 * @param array<string, mixed> $in
 * @return array<string, mixed>|null null, wenn Referenz oder Status ungültig sind.
 */
function sh24_outcome_from_input(array $in, int $now): ?array
{
    $ref = (string) ($in['ref'] ?? '');
    $status = (string) ($in['status'] ?? '');
    if (!preg_match('/^SH-\d{6}-[A-F0-9]{5}$/', $ref) || !isset(SH24_STATUS[$status])) {
        return null;
    }
    $grund = (string) ($in['grund'] ?? '');
    $wert = (string) ($in['wert'] ?? '');
    $rueck = sh24_pick_keys($in['rueckfrage'] ?? [], SH24_RUECKFRAGE);
    // Lücke: kurzes Stichwort zur nicht bedienten Leistung, z. B. "Fliesen".
    // Nur Buchstaben, Ziffern, Leer- und Bindestriche – keine Namen oder Adressen gewollt,
    // deshalb kurz und ohne Sonderzeichen, die in einer Adresse vorkämen.
    $luecke = trim((string) ($in['luecke'] ?? ''));
    $luecke = preg_replace('/[^\p{L}\p{N} \-]/u', '', $luecke) ?? '';
    $luecke = mb_substr(preg_replace('/\s+/u', ' ', $luecke) ?? '', 0, 40);

    return [
        'ref'        => $ref,
        'ts'         => date('c', $now),
        'status'     => $status,
        'grund'      => isset(SH24_GRUND[$grund]) ? $grund : '',
        'wert'       => isset(SH24_WERT[$wert]) ? $wert : '',
        'rueckfrage' => $rueck,
        'luecke'     => $luecke,
    ];
}

function sh24_outcome_append(string $storage, array $outcome): bool
{
    $dir = sh24_nachfrage_dir($storage);
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false;
    }
    $file = $dir . '/ergebnisse.jsonl';
    $line = json_encode($outcome, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $ok = $line !== false && @file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX) !== false;
    @chmod($file, 0600);
    return $ok;
}

/** @return array<string, array<string, mixed>> Letztes Ergebnis je Referenz. */
function sh24_outcomes_latest(string $storage): array
{
    $latest = [];
    foreach (sh24_read_jsonl(sh24_nachfrage_dir($storage) . '/ergebnisse.jsonl') as $row) {
        if (isset($row['ref']) && is_string($row['ref'])) {
            $latest[$row['ref']] = $row;
        }
    }
    return $latest;
}

/**
 * Anonymisiert alte Einträge: Nach SH24_REF_TAGE wird das letzte Ergebnis in
 * den Registereintrag übernommen und die Referenz entfernt. Danach lässt sich
 * kein Eintrag mehr einer gespeicherten Anfrage zuordnen.
 *
 * @return int Anzahl anonymisierter Einträge
 */
function sh24_compact(string $storage, int $now): int
{
    $dir = sh24_nachfrage_dir($storage);
    $cutoff = date('Y-m-d', $now - SH24_REF_TAGE * 86400);
    $latest = sh24_outcomes_latest($storage);
    $dropped = [];
    $count = 0;

    foreach (glob($dir . '/register-*.jsonl') ?: [] as $file) {
        $rows = sh24_read_jsonl($file);
        $changed = false;
        foreach ($rows as $i => $row) {
            if (!isset($row['ref']) || (string) ($row['tag'] ?? '') >= $cutoff) {
                continue;
            }
            $ref = (string) $row['ref'];
            if (isset($latest[$ref])) {
                $o = $latest[$ref];
                unset($o['ref'], $o['ts']);
                $rows[$i]['ergebnis'] = $o;
            }
            unset($rows[$i]['ref']);
            $dropped[$ref] = true;
            $changed = true;
            $count++;
        }
        if ($changed) {
            $text = '';
            foreach ($rows as $row) {
                $text .= json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
            }
            $tmp = $file . '.tmp-' . bin2hex(random_bytes(4));
            if (@file_put_contents($tmp, $text, LOCK_EX) !== false) {
                @chmod($tmp, 0600);
                @rename($tmp, $file);
            }
        }
    }

    if ($dropped !== []) {
        $file = $dir . '/ergebnisse.jsonl';
        $keep = '';
        foreach (sh24_read_jsonl($file) as $row) {
            if (!isset($dropped[(string) ($row['ref'] ?? '')])) {
                $keep .= json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
            }
        }
        $tmp = $file . '.tmp-' . bin2hex(random_bytes(4));
        if (@file_put_contents($tmp, $keep, LOCK_EX) !== false) {
            @chmod($tmp, 0600);
            @rename($tmp, $file);
        }
    }
    return $count;
}

/** Ergebnis zu einem Eintrag: eingebettet (anonymisiert) oder über die Referenz. */
function sh24_outcome_of(array $entry, array $latest): ?array
{
    if (isset($entry['ergebnis']) && is_array($entry['ergebnis'])) {
        return $entry['ergebnis'];
    }
    $ref = (string) ($entry['ref'] ?? '');
    return $ref !== '' && isset($latest[$ref]) ? $latest[$ref] : null;
}

/* ------------------------------------------------------------------ */
/* Auswertung                                                          */
/* ------------------------------------------------------------------ */

/** Beschriftung der Datenlage. Bewusst ohne Signifikanzbehauptung. */
function sh24_evidence_label(int $n): string
{
    if ($n < 5) {
        return 'Einzelfälle – nur Hinweis';
    }
    if ($n < 20) {
        return 'Pilotbasis';
    }
    return 'Wiederholt beobachtet (keine Statistik)';
}

/** Gilt eine Anfrage als vollständig genug für eine Einschätzung ohne Grundsatzrückfrage? */
function sh24_is_complete(array $e): bool
{
    $hasScope = ($e['flaeche'] ?? false) === true || (int) ($e['fotos'] ?? 0) > 0;
    if (($e['vorhaben'] ?? '') === 'uebergabe') {
        return $hasScope && ($e['vorlauf'] ?? 'kein') !== 'kein' && ($e['anforderungen'] ?? []) !== [];
    }
    return $hasScope && ($e['beschreibung'] ?? 'leer') !== 'leer';
}

/**
 * Verdichtet Register und Ergebnisse.
 *
 * @param list<array<string, mixed>> $entries
 * @param array<string, array<string, mixed>> $latest
 * @return array<string, mixed>
 */
function sh24_aggregate(array $entries, array $latest, string $from, string $to): array
{
    $agg = [
        'zeitraum' => [$from, $to],
        'n' => 0,
        'mitErgebnis' => 0,
        'auftrag' => 0,
        'leistung' => [],
        'kombination' => [],
        'anforderung' => [],
        'offen' => [],
        'grund' => [],
        'luecke' => [],
        'rueckfrage' => [],
        'kanal' => [],
        'vorhaben' => [],
    ];

    $bump = static function (array &$bucket, string $key, ?array $o): void {
        if (!isset($bucket[$key])) {
            $bucket[$key] = ['n' => 0, 'ergebnis' => 0, 'auftrag' => 0, 'wert' => []];
        }
        $bucket[$key]['n']++;
        if ($o !== null) {
            $bucket[$key]['ergebnis']++;
            if (($o['status'] ?? '') === 'auftrag') {
                $bucket[$key]['auftrag']++;
                $w = (string) ($o['wert'] ?? '');
                if ($w !== '') {
                    $bucket[$key]['wert'][$w] = ($bucket[$key]['wert'][$w] ?? 0) + 1;
                }
            }
        }
    };

    foreach ($entries as $e) {
        $tag = (string) ($e['tag'] ?? '');
        if ($tag < $from || $tag > $to) {
            continue;
        }
        $o = sh24_outcome_of($e, $latest);
        // Testanfragen markiert der Betreiber mit dem Stichwort "test" (docs/NACHFRAGE-SYSTEM.md § 5).
        if ($o !== null && mb_strtolower((string) ($o['luecke'] ?? '')) === 'test') {
            continue;
        }
        $agg['n']++;
        if ($o !== null) {
            $agg['mitErgebnis']++;
            if (($o['status'] ?? '') === 'auftrag') {
                $agg['auftrag']++;
            }
        }

        $leistung = (string) ($e['leistung'] ?? '') ?: '(ohne)';
        $bump($agg['leistung'], $leistung, $o);
        foreach ((array) ($e['zusatz'] ?? []) as $z) {
            $bump($agg['kombination'], $leistung . ' + ' . $z, $o);
        }
        foreach ((array) ($e['anforderungen'] ?? []) as $a) {
            $bump($agg['anforderung'], (string) $a, $o);
        }
        foreach ((array) ($e['offen'] ?? []) as $q) {
            $bump($agg['offen'], (string) $q, $o);
        }
        $bump($agg['kanal'], (string) ($e['kanal'] ?? 'unbekannt'), $o);

        // Vergleich: Übergabe-Einstieg gegen übrige Räumungsanfragen mit festem Termin oder Anlass.
        $gruppe = ($e['vorhaben'] ?? '') === 'uebergabe' ? 'uebergabe' : 'andere';
        if (!isset($agg['vorhaben'][$gruppe])) {
            $agg['vorhaben'][$gruppe] = ['n' => 0, 'vollstaendig' => 0, 'mitErgebnis' => 0, 'rueckfrage' => 0, 'auftrag' => 0, 'zusatzSumme' => 0];
        }
        $v = &$agg['vorhaben'][$gruppe];
        $v['n']++;
        $v['vollstaendig'] += sh24_is_complete($e) ? 1 : 0;
        $v['zusatzSumme'] += count((array) ($e['zusatz'] ?? [])) + count(array_filter(
            (array) ($e['anforderungen'] ?? []),
            static fn($a) => in_array($a, ['einbauten', 'boden-raus', 'boden-neu', 'streichen', 'tapeten'], true)
        ));
        if ($o !== null) {
            $v['mitErgebnis']++;
            $v['rueckfrage'] += ((array) ($o['rueckfrage'] ?? [])) !== [] ? 1 : 0;
            $v['auftrag'] += ($o['status'] ?? '') === 'auftrag' ? 1 : 0;
        }
        unset($v);

        if ($o !== null) {
            $g = (string) ($o['grund'] ?? '');
            if ($g !== '') {
                $agg['grund'][$g] = ($agg['grund'][$g] ?? 0) + 1;
            }
            $l = (string) ($o['luecke'] ?? '');
            if ($l !== '') {
                $key = mb_strtolower($l);
                $agg['luecke'][$key] = ($agg['luecke'][$key] ?? 0) + 1;
            }
            foreach ((array) ($o['rueckfrage'] ?? []) as $r) {
                $rk = $leistung . ': ' . (SH24_RUECKFRAGE[$r] ?? $r);
                $agg['rueckfrage'][$rk] = ($agg['rueckfrage'][$rk] ?? 0) + 1;
            }
        }
    }

    foreach (['leistung', 'kombination', 'anforderung', 'offen', 'kanal'] as $k) {
        uasort($agg[$k], static fn($a, $b) => $b['n'] <=> $a['n']);
    }
    foreach (['grund', 'luecke', 'rueckfrage'] as $k) {
        arsort($agg[$k]);
    }
    return $agg;
}

/** Häufigste Wertklasse unter den Aufträgen eines Themas. */
function sh24_top_wert(array $bucket): string
{
    if (($bucket['wert'] ?? []) === []) {
        return 'unbekannt';
    }
    arsort($bucket['wert']);
    return SH24_WERT[(string) array_key_first($bucket['wert'])] ?? 'unbekannt';
}

/**
 * Das Nachfrageverzeichnis: je Erkenntnis Häufigkeit, Evidenz, Wert,
 * Bedienbarkeit und die Art des nächsten Schritts. Die Regeln sind
 * bewusst einfach und in docs/NACHFRAGE-SYSTEM.md begründet; sie schlagen
 * vor, der Betreiber entscheidet.
 *
 * @return list<array<string, string|int>>
 */
function sh24_demand_register(array $agg): array
{
    $rows = [];
    $n = max(1, (int) $agg['n']);

    // 1. Versorgungslücken: von uns abgesagt, weil Leistung oder Fachbetrieb fehlt.
    foreach ($agg['luecke'] as $thema => $count) {
        $rows[] = [
            'art' => 'Versorgungslücke',
            'thema' => (string) $thema,
            'haeufigkeit' => $count,
            'evidenz' => sh24_evidence_label($count),
            'wert' => 'unbekannt',
            'bedienbar' => 'nein',
            'schritt' => $count >= 3 ? 'Kapazität gewinnen (Partner/Fachbetrieb prüfen) – erst danach eine Angebotsseite' : 'Beobachten',
        ];
    }

    // 2. Anforderungen, die wir nicht oder nur über Fachbetriebe erfüllen.
    foreach ($agg['anforderung'] as $key => $b) {
        $zust = SH24_ANFORDERUNGEN[$key][1] ?? 'eigen';
        if ($zust === 'eigen') {
            continue;
        }
        $rows[] = [
            'art' => $zust === 'nicht' ? 'Versorgungslücke' : 'Fachbetrieb nötig',
            'thema' => SH24_ANFORDERUNGEN[$key][0] ?? $key,
            'haeufigkeit' => $b['n'],
            'evidenz' => sh24_evidence_label($b['n']),
            'wert' => sh24_top_wert($b),
            'bedienbar' => $zust === 'nicht' ? 'nein' : 'mit Partner',
            'schritt' => $zust === 'nicht'
                ? ($b['n'] >= 3 ? 'Kapazität gewinnen oder klar verweisen – keine Angebotsseite ohne Ausführende' : 'Beobachten')
                : ($b['n'] >= 3 ? 'Ablauf verändern: festen Fachbetrieb für Übergaben vereinbaren' : 'Beobachten'),
        ];
    }

    // 3. Unsicherheit vor der Anfrage.
    foreach ($agg['offen'] as $key => $b) {
        $share = $b['n'] / $n;
        $rows[] = [
            'art' => 'Unsicherheit vor Kontakt',
            'thema' => SH24_OFFEN[$key] ?? $key,
            'haeufigkeit' => $b['n'],
            'evidenz' => sh24_evidence_label($b['n']),
            'wert' => '–',
            'bedienbar' => 'ja',
            'schritt' => ($b['n'] >= 5 && $share >= 0.25)
                ? 'Bestehende Seite verbessern: Frage dort beantworten, wo die Anfrage startet'
                : 'Im Erstgespräch beantworten, weiter zählen',
        ];
    }

    // 4. Kombinationen mit mindestens drei Anfragen.
    foreach ($agg['kombination'] as $key => $b) {
        if ($b['n'] < 3) {
            continue;
        }
        $rows[] = [
            'art' => 'Kombination',
            'thema' => (string) $key,
            'haeufigkeit' => $b['n'],
            'evidenz' => sh24_evidence_label($b['n']),
            'wert' => sh24_top_wert($b),
            'bedienbar' => 'ja',
            'schritt' => $b['n'] >= 5 ? 'Ablauf verändern: als gebündelten Termin anbieten und messen' : 'Beobachten',
        ];
    }

    // 5. Absagen aus Kapazitäts- oder Gebietsgründen.
    foreach (['kapazitaet' => 'Keine Kapazität zum Wunschtermin', 'gebiet' => 'Außerhalb des Einsatzgebiets', 'zu-klein' => 'Auftrag zu klein für die Anfahrt'] as $g => $label) {
        $c = (int) ($agg['grund'][$g] ?? 0);
        if ($c === 0) {
            continue;
        }
        $rows[] = [
            'art' => 'Nicht bedient',
            'thema' => $label,
            'haeufigkeit' => $c,
            'evidenz' => sh24_evidence_label($c),
            'wert' => 'unbekannt',
            'bedienbar' => 'nein',
            'schritt' => $g === 'zu-klein'
                ? ($c >= 3 ? 'Ablauf verändern: kleine Aufgaben zu flexiblen Sammelterminen bündeln' : 'Beobachten')
                : ($c >= 3 ? 'Kapazität gewinnen oder Einsatzgebiet ehrlich ausweisen' : 'Beobachten'),
        ];
    }

    // 6. Häufige Rückfragen je Leistung: fehlende Formularangabe.
    foreach ($agg['rueckfrage'] as $key => $c) {
        if ($c < 3) {
            continue;
        }
        $rows[] = [
            'art' => 'Rückfrage nötig',
            'thema' => (string) $key,
            'haeufigkeit' => $c,
            'evidenz' => sh24_evidence_label($c),
            'wert' => '–',
            'bedienbar' => 'ja',
            'schritt' => 'Ablauf verändern: Angabe im Anfrageweg dieser Leistung gezielt erfragen',
        ];
    }

    usort($rows, static fn($a, $b) => $b['haeufigkeit'] <=> $a['haeufigkeit']);
    return $rows;
}
