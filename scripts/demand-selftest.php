<?php
/**
 * Selbsttest Nachfrageregister und Betriebsbereich (Einheitsteil).
 * Aufruf über `npm run audit:demand:selftest` (scripts/demand-selftest.mjs).
 *
 * ALLE DATEN HIER SIND ERFUNDEN und dienen nur der Prüfung. Sie landen in
 * einem temporären Verzeichnis, nie in src/data oder der echten Ablage.
 */

declare(strict_types=1);

require __DIR__ . '/../public/api/lib/nachfrage.php';
require __DIR__ . '/../public/api/lib/betrieb-auth.php';

$passed = 0;
function check(bool $ok, string $what): void
{
    global $passed;
    if (!$ok) {
        fwrite(STDERR, "FEHLER: $what\n");
        exit(1);
    }
    $passed++;
}

$now = strtotime('2026-10-22 12:00:00');
$tmp = sys_get_temp_dir() . '/sh24-demand-' . bin2hex(random_bytes(4));
mkdir($tmp, 0700, true);

/* 1. Registereintrag enthält keine Kontaktdaten und keinen Freitext. */
$fields = [
    'leistung' => 'Wohnungsauflösung', 'umfang' => 'Vollständige Wohnung', 'anlass' => 'Neuvermietung',
    'objektart' => '3-Zimmer-Wohnung', 'zeitraum' => 'Im nächsten Monat', 'stichtag' => '2026-11-10',
    'gebiet' => 'regulaer', 'plz' => '10969', 'quelle' => 'organic | erfunden.example',
    'vorhaben' => 'uebergabe', 'flaeche' => '3 Zimmer',
    'beschreibung' => 'ERFUNDEN Freitext Max Mustermann Musterstraße 1',
    'name' => 'ERFUNDEN Max Mustermann', 'telefon' => '0301234567', 'mail' => 'erfunden@example.test', 'ort' => 'Kreuzberg',
];
$entry = sh24_ledger_entry($fields, ['Reinigung', 'Unbekanntes Extra'], ['Keller'], ['geraeumt', 'streichen'], ['kosten'], 2, 'SH-261022-ABCDE', $now);
$json = json_encode($entry, JSON_UNESCAPED_UNICODE);
foreach (['Mustermann', '0301234567', 'example.test', 'Musterstraße', 'Kreuzberg', '10969', '2026-11-10', 'erfunden.example'] as $pii) {
    check(!str_contains($json, $pii), "Registereintrag enthält $pii");
}
$expectedKeys = ['v','ref','tag','leistung','umfang','anlass','objektart','zeitraum','vorlauf','gebiet','plz3','kanal','vorhaben','zusatz','nebenraeume','anforderungen','offen','fotos','flaeche','beschreibung'];
check(array_keys($entry) === $expectedKeys, 'Registereintrag hat genau die erlaubten Felder');
check($entry['plz3'] === '109' && $entry['kanal'] === 'organic' && $entry['vorlauf'] === '14-29', 'Abgeleitete Felder');
check($entry['zusatz'] === ['Reinigung', 'sonstige'] && $entry['beschreibung'] === 'kurz', 'Zusatz und Textlänge vergröbert');

/* 2. Allowlists. */
check(sh24_pick_keys(['streichen', 'gibtsnicht', 'geraeumt', 'geraeumt', ['x']], SH24_ANFORDERUNGEN) === ['geraeumt', 'streichen'], 'Unbekannte Schlüssel verworfen, Duplikate entfernt, feste Reihenfolge');
check(sh24_pick_keys('kosten', SH24_OFFEN) === [], 'Kein Array wird abgewiesen');

/* 3. Vorlauf-Buckets. */
foreach (['' => 'kein', 'kaputt' => 'kein', '2026-10-01' => 'vergangen', '2026-10-25' => '0-6', '2026-10-30' => '7-13', '2026-11-30' => '30+'] as $in => $want) {
    check(sh24_vorlauf_bucket($in, $now) === $want, "Vorlauf $in");
}

/* 4. Ergebnis-Eingaben. */
check(sh24_outcome_from_input(['ref' => 'kaputt', 'status' => 'auftrag'], $now) === null, 'Ungültige Referenz abgewiesen');
check(sh24_outcome_from_input(['ref' => 'SH-261022-ABCDE', 'status' => 'erfunden'], $now) === null, 'Ungültiger Status abgewiesen');
$o = sh24_outcome_from_input(['ref' => 'SH-261022-ABCDE', 'status' => 'abgesagt-wir', 'grund' => 'nicht-im-angebot', 'wert' => 'quatsch', 'rueckfrage' => ['termin', 'boese'], 'luecke' => 'Fliesen <b>@max'], $now);
check($o !== null && $o['wert'] === '' && $o['rueckfrage'] === ['termin'] && $o['luecke'] === 'Fliesen bmax', 'Ergebnis bereinigt');

/* 5. Schreiben, Lesen, Auswerten mit erfundenen Einträgen. */
$mk = static function (string $ref, string $tag, string $leistung, string $vorhaben, array $anf, array $offen, array $zusatz, int $fotos) use ($now): array {
    $e = sh24_ledger_entry(['leistung' => $leistung, 'vorhaben' => $vorhaben, 'stichtag' => $vorhaben ? '2026-12-01' : '', 'flaeche' => '1', 'beschreibung' => 'ERFUNDEN'], $zusatz, [], $anf, $offen, $fotos, $ref, $now);
    $e['tag'] = $tag;
    return $e;
};
$synthetic = [
    $mk('SH-261001-AAAA1', '2026-10-01', 'Wohnungsauflösung', 'uebergabe', ['geraeumt', 'reparaturen'], ['kosten'], ['Reinigung'], 2),
    $mk('SH-261002-AAAA2', '2026-10-02', 'Wohnungsauflösung', 'uebergabe', ['streichen', 'reparaturen'], ['kosten', 'termin'], ['Reinigung'], 0),
    $mk('SH-261003-AAAA3', '2026-10-03', 'Wohnungsauflösung', '', [], ['kosten'], ['Reinigung'], 1),
    $mk('SH-261004-AAAA4', '2026-10-04', 'Möbelmontage', '', [], [], [], 0),
    $mk('SH-250101-0DD01', '2025-01-01', 'Entrümpelung', '', [], [], [], 0),
];
check(count($synthetic[1]['anforderungen']) === 2, 'Anforderungen nur im Übergabe-Einstieg gespeichert');
foreach ($synthetic as $e) {
    check(sh24_ledger_append($tmp, $e), 'Anhängen ' . $e['ref']);
}
check(count(sh24_ledger_read($tmp)) === 5, 'Register liest alle Monate');
sh24_outcome_append($tmp, sh24_outcome_from_input(['ref' => 'SH-261001-AAAA1', 'status' => 'auftrag', 'wert' => '1500-5000'], $now));
sh24_outcome_append($tmp, sh24_outcome_from_input(['ref' => 'SH-261002-AAAA2', 'status' => 'abgesagt-wir', 'grund' => 'nicht-im-angebot', 'luecke' => 'Fliesen', 'rueckfrage' => ['masse']], $now));
sh24_outcome_append($tmp, sh24_outcome_from_input(['ref' => 'SH-261003-AAAA3', 'status' => 'in-klaerung'], $now));
sh24_outcome_append($tmp, sh24_outcome_from_input(['ref' => 'SH-261003-AAAA3', 'status' => 'auftrag', 'wert' => '500-1500', 'rueckfrage' => ['umfang']], $now));
sh24_outcome_append($tmp, sh24_outcome_from_input(['ref' => 'SH-250101-0DD01', 'status' => 'abgesagt-kunde', 'grund' => 'preis'], $now));
$latest = sh24_outcomes_latest($tmp);
check($latest['SH-261003-AAAA3']['status'] === 'auftrag', 'Letztes Ergebnis gilt');

$agg = sh24_aggregate(sh24_ledger_read($tmp), $latest, '2026-10-01', '2026-10-31');
check($agg['n'] === 4 && $agg['mitErgebnis'] === 3 && $agg['auftrag'] === 2, 'Zeitraum und Zählung');
check($agg['leistung']['Wohnungsauflösung']['n'] === 3 && $agg['leistung']['Wohnungsauflösung']['auftrag'] === 2, 'Auftragszählung je Leistung');
check($agg['kombination']['Wohnungsauflösung + Reinigung']['n'] === 3, 'Kombination gezählt');
check($agg['offen']['kosten']['n'] === 3 && $agg['luecke']['fliesen'] === 1, 'Unsicherheit und Lücke gezählt');
check($agg['vorhaben']['uebergabe']['n'] === 2 && $agg['vorhaben']['uebergabe']['vollstaendig'] === 2 && $agg['vorhaben']['andere']['n'] === 2, 'Vergleichsgruppen');
check($agg['vorhaben']['uebergabe']['rueckfrage'] === 1 && $agg['vorhaben']['andere']['rueckfrage'] === 1, 'Rückfragen je Gruppe');

$register = sh24_demand_register($agg);
$byTheme = [];
foreach ($register as $r) {
    $byTheme[$r['thema']] = $r;
}
check(isset($byTheme['Reparaturen an Fenstern, Türen, Sanitär oder Elektrik']) && $byTheme['Reparaturen an Fenstern, Türen, Sanitär oder Elektrik']['bedienbar'] === 'nein', 'Nicht angebotene Anforderung als Lücke');
check($byTheme['Reparaturen an Fenstern, Türen, Sanitär oder Elektrik']['schritt'] === 'Beobachten', 'Unter drei Fällen nur beobachten – keine Seite');
check($byTheme['Wohnungsauflösung + Reinigung']['art'] === 'Kombination' && $byTheme['Wohnungsauflösung + Reinigung']['evidenz'] === 'Einzelfälle – nur Hinweis', 'Kombination mit Evidenzhinweis');
check(!str_contains(json_encode($register), 'SH-'), 'Verzeichnis enthält keine Referenzen');

/* 5b. Als Test markierte Anfragen zählen nicht. */
$testEntry = $mk('SH-261005-AAAA5', '2026-10-05', 'Entrümpelung', '', [], ['kosten'], [], 0);
sh24_ledger_append($tmp, $testEntry);
sh24_outcome_append($tmp, sh24_outcome_from_input(['ref' => 'SH-261005-AAAA5', 'status' => 'keine-reaktion', 'grund' => 'sonstiges', 'luecke' => 'Test'], $now));
$aggT = sh24_aggregate(sh24_ledger_read($tmp), sh24_outcomes_latest($tmp), '2026-10-01', '2026-10-31');
check($aggT['n'] === 4 && !isset($aggT['luecke']['test']) && !isset($aggT['leistung']['Entrümpelung']), 'Testanfrage ausgeschlossen');

/* 6. Anonymisierung nach SH24_REF_TAGE. */
check(sh24_compact($tmp, $now) === 1, 'Ein alter Eintrag anonymisiert');
$after = sh24_ledger_read($tmp);
$old = array_values(array_filter($after, static fn($e) => $e['tag'] === '2025-01-01'))[0];
check(!isset($old['ref']) && $old['ergebnis']['grund'] === 'preis', 'Referenz entfernt, Ergebnis übernommen');
check(!isset(sh24_outcomes_latest($tmp)['SH-250101-0DD01']) && isset(sh24_outcomes_latest($tmp)['SH-261001-AAAA1']), 'Altes Ergebnis gelöscht, neue bleiben');
$aggAll = sh24_aggregate($after, sh24_outcomes_latest($tmp), '2025-01-01', '2026-12-31');
check($aggAll['grund']['preis'] === 1, 'Anonymisiertes Ergebnis zählt weiter');
check(sh24_compact($tmp, $now) === 0, 'Anonymisierung ist idempotent');

/* 7. Sitzung und CSRF. */
$secret = str_repeat('e', 64);
$token = sh24_session_token($secret, $now + 3600);
check(sh24_session_valid($secret, $token, $now), 'Gültige Sitzung');
check(!sh24_session_valid($secret, $token, $now + 7200), 'Abgelaufene Sitzung');
check(!sh24_session_valid(str_repeat('f', 64), $token, $now), 'Anderes Geheimnis');
check(!sh24_session_valid($secret, ($now + 9999) . '.' . explode('.', $token)[1], $now), 'Manipulierte Ablaufzeit');
check(!sh24_session_valid($secret, sh24_session_token($secret, $now + 30 * 86400), $now), 'Zu lange Laufzeit abgewiesen');
check(!sh24_session_valid($secret, 'kaputt', $now), 'Kaputtes Token');
check(sh24_csrf($secret, $token) !== sh24_csrf($secret, sh24_session_token($secret, $now + 3000)), 'CSRF je Sitzung verschieden');

echo $passed . " Einheitsfälle bestanden (erfundene Daten in $tmp)\n";
