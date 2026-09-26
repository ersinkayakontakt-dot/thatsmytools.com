<?php
/**
 * VORLAGE FÜR DIE LOKALE KONFIGURATION
 * ====================================
 * Kopieren nach config.local.php und ausfüllen.
 *
 *   cp config.example.php config.local.php
 *
 * config.local.php ist in .gitignore ausgenommen und gehört nicht ins
 * Repository. Seit dem SMTP-Versand enthält sie ein Passwort – sie darf
 * deshalb unter keinen Umständen eingecheckt werden, und auf dem Server
 * gehört sie auf Rechte 600.
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

    /* ---------------------------------------------------------------- */
    /* Versandweg                                                        */
    /* ---------------------------------------------------------------- */

    /*
     * OHNE diese Angaben verschickt PHP über mail(). Das übergibt die
     * Mail dem lokalen Postprogramm des Hosters, und auf Shared Hosting
     * kommt sie dann häufig nicht an: Der Server steht meist nicht im
     * SPF-Eintrag der Domain und signiert nicht mit DKIM. Empfangende
     * Postfächer werten das als Fälschung und verwerfen die Mail
     * stillschweigend. mail() meldet trotzdem Erfolg – es bestätigt nur
     * die Übernahme, nicht die Zustellung.
     *
     * MIT diesen Angaben meldet sich das Skript am echten Postfach an
     * und verschickt darüber. Dann stimmen SPF und DKIM, weil der
     * Mailanbieter selbst versendet.
     *
     * Die Werte stehen im Hostinger-Panel unter E-Mail-Konten. Üblich:
     *   'smtpHost' => 'smtp.hostinger.com', Port 465, 'ssl'
     * Alternativ STARTTLS:
     *   Port 587 mit 'smtpSecure' => 'tls'
     *
     * smtpUser ist die vollständige Adresse des Postfachs, nicht nur der
     * Teil vor dem @. Am saubersten ist ein eigenes Postfach für die
     * Website (etwa website@schnellhelfer24.de), dessen Passwort sich
     * wechseln lässt, ohne dass jemand sein Arbeitspostfach anfassen muss.
     */
    // 'smtpHost'   => 'smtp.hostinger.com',
    // 'smtpPort'   => 465,
    // 'smtpUser'   => 'website@schnellhelfer24.de',
    // 'smtpPass'   => 'HIER DAS POSTFACH-PASSWORT',
    // 'smtpSecure' => 'ssl',

    /*
     * NACH DEM EINRICHTEN PRÜFEN:
     *   1. Echte Testanfrage senden. Kommt die Mail an?
     *   2. In _storage/anfragen/ die neueste JSON-Datei öffnen:
     *      "mailWeg" muss "smtp" sein, "mailVersand" muss "ok" sein.
     *      Steht dort "mailFehler", nennt der Text den Schritt, der
     *      gescheitert ist (Anmeldung, Verbindung, RCPT TO …).
     *   3. In der angekommenen Mail den Kopf anzeigen lassen und
     *      kontrollieren, dass SPF und DKIM auf "pass" stehen.
     */

    /* ---------------------------------------------------------------- */
    /* Messsystem (events.php)                                          */
    /* ---------------------------------------------------------------- */

    // Der Ereignis-Endpunkt bleibt inaktiv, bis er hier ausdrücklich
    // eingeschaltet wird. Ein Messsystem darf nicht dadurch aktiv werden,
    // dass jemand eine Datei hochlädt.
    //
    // VOR DEM EINSCHALTEN:
    //   1. Datenschutzerklärung um den Abschnitt zur Reichweitenmessung
    //      ergänzen (Zweck, Kategorien, Aufbewahrung, Rechtsgrundlage).
    //   2. Anwaltlich prüfen lassen, ob die Messung ohne Einwilligung
    //      zulässig ist. Technische Datensparsamkeit allein genügt dafür
    //      nicht – siehe CONTENT-TODO.md.
    //   3. Nach dem Einschalten eine Testanfrage senden und in
    //      _storage/events/JJJJ-MM-TT.jsonl prüfen, dass dort weder eine
    //      IP-Adresse noch Formularinhalte stehen.
    'eventsEnabled' => false,
];
