<?php
/**
 * Sitzung und CSRF-Schutz des Betriebsbereichs (GROW-2026-01).
 *
 * Eigene Datei, damit der Selbsttest die Prüfungen ohne Webserver aufrufen
 * kann (scripts/demand-selftest.mjs). Kein Zustand auf dem Server: Das
 * Sitzungstoken trägt seine Ablaufzeit und ist mit dem Geheimnis aus
 * sh24-config.php signiert. Ein neues Geheimnis beendet alle Sitzungen.
 */

declare(strict_types=1);

const SH24_SESSION_SECONDS = 12 * 3600;

/** Signiertes Sitzungstoken: "<ablauf>.<hmac>". */
function sh24_session_token(string $secret, int $expires): string
{
    return $expires . '.' . hash_hmac('sha256', 'session|' . $expires, $secret);
}

function sh24_session_valid(string $secret, string $token, int $now): bool
{
    $parts = explode('.', $token, 2);
    if (count($parts) !== 2 || !ctype_digit($parts[0])) {
        return false;
    }
    $expires = (int) $parts[0];
    if ($expires < $now || $expires > $now + SH24_SESSION_SECONDS + 60) {
        return false;
    }
    return hash_equals(hash_hmac('sha256', 'session|' . $expires, $secret), $parts[1]);
}

function sh24_csrf(string $secret, string $sessionToken): string
{
    return hash_hmac('sha256', 'csrf|' . $sessionToken, $secret);
}

