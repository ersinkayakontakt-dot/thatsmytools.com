<?php
/**
 * VORLAGE FÜR DIE LOKALE KONFIGURATION
 * ====================================
 * Kopieren nach config.local.php und ausfüllen.
 *
 *   cp config.example.php config.local.php
 *
 * config.local.php ist in .gitignore ausgenommen und gehört nicht ins
 * Repository. Sie enthält keine Passwörter, aber die echten
 * Empfängeradressen.
 *
 * WICHTIG: Der Absender sollte eine Adresse der eigenen Domain sein.
 * Mails mit fremden Absenderdomains (etwa @gmail.com) werden von vielen
 * Postfächern als Spam eingestuft, weil SPF und DKIM nicht passen.
 */

declare(strict_types=1);

return [
    // Wohin die Anfragen gehen sollen
    'recipient' => 'anfrage@schnellhelfer24.de',

    // Absender der Benachrichtigung (Domain-Adresse verwenden)
    'from'      => 'website@schnellhelfer24.de',
    'fromName'  => 'Schnellhelfer24 Website',

    // Sicherste Variante: Ablage außerhalb des Webverzeichnisses.
    // Bei Hostinger liegt das Webverzeichnis üblicherweise unter
    // /home/BENUTZER/domains/schnellhelfer24.de/public_html
    // Dann passt zum Beispiel:
    // 'storageDir' => '/home/BENUTZER/domains/schnellhelfer24.de/sh24-daten',

    // Löschfrist für hochgeladene Fotos in Tagen.
    // Muss mit der Angabe in der Datenschutzerklärung übereinstimmen.
    'retentionDays' => 90,
];
