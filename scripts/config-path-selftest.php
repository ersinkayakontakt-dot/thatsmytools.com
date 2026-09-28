<?php
/**
 * Selbsttest für public/api/lib/config.php (OPS-2026-01).
 * Baut eine erfundene Verzeichnisstruktur in einem Temp-Ordner nach:
 *   <tmp>/domain/sh24-config.php
 *   <tmp>/domain/public_html/api/config.local.php
 * Aufruf: php scripts/config-path-selftest.php
 */
declare(strict_types=1);
require __DIR__ . '/../public/api/lib/config.php';

$fails = 0;
function check(string $name, bool $ok): void {
    global $fails;
    echo ($ok ? '  ok   ' : '  FAIL ') . $name . PHP_EOL;
    if (!$ok) $fails++;
}

$root = sys_get_temp_dir() . '/sh24-config-selftest-' . bin2hex(random_bytes(4));
$api = $root . '/domain/public_html/api';
mkdir($api, 0700, true);
$outside = $root . '/domain/sh24-config.php';
$inside = $api . '/config.local.php';

[$cfg, $path] = sh24_load_local_config($api);
check('keine Datei → leere Konfiguration', $cfg === [] && $path === '');

file_put_contents($inside, "<?php return ['to' => 'innen@example.invalid', 'nurInnen' => 1];");
[$cfg, $path] = sh24_load_local_config($api);
check('nur config.local.php → wird gelesen (Rückwärtskompatibel)', ($cfg['to'] ?? '') === 'innen@example.invalid' && $path === $inside);

file_put_contents($outside, "<?php return ['to' => 'aussen@example.invalid'];");
[$cfg, $path] = sh24_load_local_config($api);
check('Datei oberhalb von public_html hat Vorrang', ($cfg['to'] ?? '') === 'aussen@example.invalid' && $path === $outside);
check('keine Zusammenführung mit der alten Datei', !array_key_exists('nurInnen', $cfg));

unlink($inside);
[$cfg, $path] = sh24_load_local_config($api);
check('Deploy löscht api/config.local.php → Konfiguration bleibt erhalten', ($cfg['to'] ?? '') === 'aussen@example.invalid');

file_put_contents($outside, "<?php return 'kein Array';");
[$cfg, $path] = sh24_load_local_config($api);
check('Datei ohne Array → leere Werte statt Absturz', $cfg === [] && $path === $outside);

unlink($outside);
rmdir($api); rmdir(dirname($api)); rmdir(dirname($api, 2)); rmdir($root);

echo $fails === 0 ? "Alle Fälle bestanden." . PHP_EOL : "$fails Fall/Fälle fehlgeschlagen." . PHP_EOL;
exit($fails === 0 ? 0 : 1);
