<?php
/**
 * MAILVERSAND
 * ===========
 * Kopfzeilen-Hygiene und ein schlanker SMTP-Client.
 *
 * WARUM EINE EIGENE DATEI:
 * `anfrage.php` führt beim Einbinden sofort Code aus – Rate Limit,
 * `$_POST`, Weiterleitungen. Eine Selbstprüfung könnte die Datei also gar
 * nicht einbinden, ohne die ganze Verarbeitung auszulösen. Hier liegen nur
 * Funktionen, nichts läuft beim Einbinden. Dadurch lässt sich der
 * SMTP-Ablauf gegen einen Testserver fahren:
 *
 *   npm run audit:mail:selftest
 *
 * Dieselbe Begründung wie beim dritten Parameter von
 * `validateServiceAreas()` in src/data/serviceAreas.ts: Was sich nicht
 * isoliert aufrufen lässt, lässt sich nicht gegen Gegenbeispiele laufen
 * lassen – und prüft damit nichts.
 *
 * WARUM OHNE FREMDBIBLIOTHEK:
 * Das Projekt hat genau eine Abhängigkeit. Für eine reine Textmail ohne
 * Anhänge sind es rund hundert Zeilen. Die Wohnungsfotos hängen nicht an
 * der Mail, sie liegen auf dem Server – deshalb wird kein mehrteiliger
 * MIME-Aufbau gebraucht.
 *
 * VORAUSSETZUNG: PHP 8.0 oder neuer.
 */

declare(strict_types=1);

/** Verhindert Header-Injection in E-Mail-Kopfzeilen. */
function headerSafe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
}

/**
 * Kodiert einen Kopfzeilenwert nach RFC 2047, wenn er nicht rein ASCII ist.
 * Ohne das stehen Umlaute im Betreff als rohe Bytes in der Kopfzeile, was
 * nicht zulässig ist und je nach Postfach als Buchstabensalat ankommt.
 */
function mimeHeader(string $value): string
{
    $value = headerSafe($value);
    return preg_match('/^[\x20-\x7E]*$/', $value) === 1
        ? $value
        : '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/**
 * Liest eine vollständige SMTP-Antwort.
 * Mehrzeilige Antworten erkennt man am Bindestrich an vierter Stelle
 * ("250-" geht weiter, "250 " ist die letzte Zeile).
 */
function smtpRead($socket): string
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (strlen($line) < 4 || $line[3] !== '-') {
            break;
        }
    }
    return $response;
}

/**
 * Sendet einen Befehl und prüft den Statuscode der Antwort.
 *
 * Ein leerer Befehl liest nur (für die Begrüßung und die Antwort nach dem
 * Schlusspunkt). Im Fehlerfall wird ausschließlich die Antwort des Servers
 * festgehalten, niemals der gesendete Befehl: Bei AUTH stünde dort das
 * Passwort.
 */
function smtpCommand($socket, string $command, string $expected, string $step, string &$error): bool
{
    if ($command !== '') {
        fwrite($socket, $command . "\r\n");
    }
    $response = smtpRead($socket);
    if (strncmp($response, $expected, strlen($expected)) !== 0) {
        $error = $step . ': ' . trim(substr($response, 0, 120));
        return false;
    }
    return true;
}

/**
 * Verschickt die Benachrichtigung über einen authentifizierten SMTP-Server.
 *
 * Bewusst ohne Fremdbibliothek: Das Projekt hat eine einzige Abhängigkeit,
 * und für eine reine Textmail ohne Anhänge sind es rund hundert Zeilen.
 * Die Fotos hängen nicht an der Mail, sie liegen auf dem Server – deshalb
 * wird hier kein mehrteiliger MIME-Aufbau gebraucht.
 *
 * @return array{ok: bool, error: string}
 */
function sendViaSmtp(
    array $config,
    string $to,
    string $subject,
    string $body,
    string $fromAddress,
    string $fromName,
    string $replyTo,
    string $ref
): array {
    $error   = '';
    $timeout = max(5, (int) $config['smtpTimeout']);
    $host    = parse_url((string) $config['siteUrl'], PHP_URL_HOST) ?: 'localhost';

    $requested = (string) $config['smtpSecure'];
    $secure    = in_array($requested, ['tls', 'none'], true) ? $requested : 'ssl';

    /*
     * 'none' ist ausschließlich für die Selbstprüfung da und wird hier
     * hart auf die Loopback-Adresse begrenzt.
     *
     * Ohne diesen Riegel wäre die Einstellung eine Falle: Wer sie einmal
     * zum Testen setzt und stehen lässt, schickt das Postfach-Passwort
     * unverschlüsselt durchs Netz. Lieber ein Versand, der abbricht, als
     * einer, der die Zugangsdaten preisgibt.
     */
    $plainHosts = ['127.0.0.1', '::1', 'localhost'];
    if ($secure === 'none' && !in_array((string) $config['smtpHost'], $plainHosts, true)) {
        return [
            'ok'    => false,
            'error' => 'Konfiguration: unverschluesselter Versand ist nur zur Loopback-Adresse erlaubt',
        ];
    }

    /* Zertifikat wird geprüft. Ein Mailserver, dessen Zertifikat nicht
       stimmt, ist keine Verbindung wert – auch nicht für eine Anfrage. */
    $context = stream_context_create([
        'ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true],
    ]);

    $socket = @stream_socket_client(
        ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $config['smtpHost'] . ':' . (int) $config['smtpPort'],
        $errno,
        $errstr,
        $timeout,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if (!$socket) {
        return ['ok' => false, 'error' => 'Verbindung: ' . trim((string) $errstr)];
    }
    stream_set_timeout($socket, $timeout);

    $ok = smtpCommand($socket, '', '220', 'Begruessung', $error)
        && smtpCommand($socket, 'EHLO ' . $host, '250', 'EHLO', $error);

    if ($ok && $secure === 'tls') {
        $ok = smtpCommand($socket, 'STARTTLS', '220', 'STARTTLS', $error);
        if ($ok && !@stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            $ok    = false;
            $error = 'STARTTLS: Verschluesselung konnte nicht aufgebaut werden';
        }
        if ($ok) {
            $ok = smtpCommand($socket, 'EHLO ' . $host, '250', 'EHLO nach STARTTLS', $error);
        }
    }

    if ($ok && (string) $config['smtpUser'] !== '') {
        $ok = smtpCommand($socket, 'AUTH LOGIN', '334', 'AUTH', $error)
            && smtpCommand($socket, base64_encode((string) $config['smtpUser']), '334', 'Benutzer', $error)
            && smtpCommand($socket, base64_encode((string) $config['smtpPass']), '235', 'Anmeldung', $error);
    }

    if ($ok) {
        $ok = smtpCommand($socket, 'MAIL FROM:<' . $fromAddress . '>', '250', 'MAIL FROM', $error)
            && smtpCommand($socket, 'RCPT TO:<' . $to . '>', '250', 'RCPT TO', $error)
            && smtpCommand($socket, 'DATA', '354', 'DATA', $error);
    }

    if ($ok) {
        $headers = [
            'Date: ' . date('r'),
            'Message-ID: <' . headerSafe($ref) . '@' . $host . '>',
            'From: ' . mimeHeader($fromName) . ' <' . $fromAddress . '>',
            'To: <' . $to . '>',
            'Subject: ' . mimeHeader($subject),
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            'X-Anfrage-Referenz: ' . headerSafe($ref),
        ];
        if ($replyTo !== '') {
            $headers[] = 'Reply-To: <' . headerSafe($replyTo) . '>';
        }

        /*
         * base64 statt 8bit aus zwei Gründen: SMTP erlaubt höchstens 998
         * Zeichen je Zeile, und eine lange Beschreibung hat keine
         * Zeilenumbrüche. Ein Umbruch nach Bytes würde Umlaute zerreißen.
         * Der base64-Zeichenvorrat enthält außerdem keinen Punkt, deshalb
         * ist kein Schutz vor einem versehentlichen Schlusspunkt nötig.
         */
        $message = implode("\r\n", $headers) . "\r\n\r\n"
            . rtrim(chunk_split(base64_encode($body), 76, "\r\n"), "\r\n");

        fwrite($socket, $message . "\r\n.\r\n");
        $ok = smtpCommand($socket, '', '250', 'Annahme', $error);
    }

    @fwrite($socket, "QUIT\r\n");
    @fclose($socket);

    return ['ok' => $ok, 'error' => $error];
}
