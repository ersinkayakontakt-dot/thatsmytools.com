<?php
/**
 * Erzeugt die beiden Werte für den Betriebsbereich (GROW-2026-01).
 *
 *   php scripts/betrieb-passwort.php
 *
 * Fragt das Passwort ab und gibt zwei Zeilen für sh24-config.php aus.
 * Das Passwort selbst wird nirgends gespeichert, nur sein Hash.
 */
declare(strict_types=1);

fwrite(STDOUT, "Neues Passwort für den Betriebsbereich (mindestens 12 Zeichen): ");
if (DIRECTORY_SEPARATOR === '/') {
    @shell_exec('stty -echo');
}
$pass = trim((string) fgets(STDIN));
if (DIRECTORY_SEPARATOR === '/') {
    @shell_exec('stty echo');
}
fwrite(STDOUT, "\n");
if (mb_strlen($pass) < 12) {
    fwrite(STDERR, "Zu kurz. Bitte mindestens 12 Zeichen.\n");
    exit(1);
}
echo "    'betriebPasswortHash' => " . var_export(password_hash($pass, PASSWORD_DEFAULT), true) . ",\n";
echo "    'betriebGeheimnis'    => " . var_export(bin2hex(random_bytes(32)), true) . ",\n";
