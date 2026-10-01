<?php
/**
 * Lokale Konfiguration finden (OPS-2026-01).
 *
 * Ein Push auf `hostinger-live` hat am 28.09.2026 `api/config.local.php`
 * gelöscht, weil Hostingers Git-Abgleich alles Unversionierte in
 * public_html entfernt. Deshalb wird zuerst eine Ebene OBERHALB des
 * Webverzeichnisses gesucht – dort kann kein Deployment die Datei treffen:
 *
 *   /home/<benutzer>/domains/schnellhelfer24.de/sh24-config.php   (bevorzugt)
 *   /home/<benutzer>/domains/schnellhelfer24.de/public_html/api/config.local.php
 *
 * Die erste gefundene Datei gilt allein; sie werden NICHT zusammengeführt.
 * Sonst könnte eine vergessene alte Datei neben der API unbemerkt Werte
 * der neuen überschreiben oder ergänzen.
 */

declare(strict_types=1);

/** @return list<string> Kandidaten in Suchreihenfolge. */
function sh24_config_candidates(string $apiDir): array
{
    return [
        dirname($apiDir, 2) . '/sh24-config.php',
        $apiDir . '/config.local.php',
    ];
}

/** @return array{0: array<string, mixed>, 1: string} Werte und gefundener Pfad ('' = keiner). */
function sh24_load_local_config(string $apiDir): array
{
    foreach (sh24_config_candidates($apiDir) as $path) {
        // @: außerhalb von open_basedir meldet is_file eine Warnung und liefert false.
        if (!@is_file($path)) {
            continue;
        }
        $local = require $path;
        return [is_array($local) ? $local : [], $path];
    }
    return [[], ''];
}
