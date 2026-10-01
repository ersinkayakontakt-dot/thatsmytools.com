<?php
/**
 * VORLAGE FÜR DIE LOKALE KONFIGURATION
 * ====================================
 * Kopieren und ausfüllen. Bevorzugter Ort seit 28.09.2026 (OPS-2026-01):
 *
 *   /home/<benutzer>/domains/schnellhelfer24.de/sh24-config.php
 *
 * also EINE Ebene oberhalb von public_html. Dort kann kein Deployment die
 * Datei löschen – ein Push auf hostinger-live hat genau das mit
 * api/config.local.php getan. Der alte Ort neben anfrage.php wird weiter
 * gelesen, aber nur, wenn oben keine Datei liegt.
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
    // Wohin die Anfragen gehen sollen. Dasselbe Postfach, das auch in
    // src/config/site.ts als Kontaktadresse steht.
    'recipient' => 'hello@schnellhelfer24.de',

    /*
     * Absender der Benachrichtigung. MUSS mit 'smtpUser' unten
     * übereinstimmen, sonst schreiben viele Mailserver das MAIL FROM um
     * und die DKIM-Signatur passt nicht mehr zur Kopfzeile. anfrage.php
     * korrigiert eine Abweichung selbst und vermerkt sie als
     * "mailHinweis" in der JSON-Ablage.
     *
     * Dass Absender und Empfänger dasselbe Postfach sind, ist bei einem
     * Kontaktformular normal: Die Adresse der Kundschaft steht im
     * Reply-To, ein Klick auf Antworten geht also an sie, nicht an einen
     * selbst.
     */
    'from'      => 'hello@schnellhelfer24.de',
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
     * AM 24.09.2026 FÜR schnellhelfer24.de GEPRÜFT:
     *   - MX zeigt auf mx1/mx2.hostinger.com -> Hostinger Mail, nicht Titan.
     *     Der richtige Host ist also smtp.hostinger.com.
     *   - SPF steht: v=spf1 include:_spf.mail.hostinger.com ~all
     *   - DKIM steht: hostingermail-a/-b/-c sind im DNS vorhanden
     *   - smtp.hostinger.com:465 ist erreichbar
     *
     * Die DNS-Seite ist damit vollständig vorbereitet. Es fehlt nur noch
     * der Block unten. Genau das ist die Erklärung dafür, dass bisher
     * keine Mail ankam: Der SPF-Eintrag deckt Hostingers MAILSERVER ab,
     * nicht den Webserver, über den mail() verschickt.
     *
     * smtpUser ist die vollständige Adresse des Postfachs, nicht nur der
     * Teil vor dem @, und muss mit 'from' übereinstimmen.
     *
     * Alternativ STARTTLS: Port 587 mit 'smtpSecure' => 'tls'.
     */
    'smtpHost'   => 'smtp.hostinger.com',
    'smtpPort'   => 465,
    'smtpUser'   => 'hello@schnellhelfer24.de',
    'smtpPass'   => 'HIER DAS PASSWORT DES POSTFACHS',
    'smtpSecure' => 'ssl',

    /*
     * Hinweis für später, keine Eile: Ein eigenes Postfach nur für die
     * Website (etwa website@schnellhelfer24.de) ließe sich im Passwort
     * wechseln, ohne dass jemand sein Arbeitspostfach anfassen muss.
     * Solange hello@ verwendet wird, bedeutet ein Passwortwechsel dort
     * auch einen Eingriff hier.
     */

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
