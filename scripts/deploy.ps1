<#
.SYNOPSIS
    Baut die Website und überträgt sie per FTPS zu Hostinger.

.DESCRIPTION
    Für die manuelle Übertragung vom eigenen Windows-Rechner aus.

    Das Skript braucht KEINE Zusatzsoftware. Es nutzt die in Windows
    eingebaute .NET-Klasse FtpWebRequest mit expliziter TLS-Verschlüsselung
    (FTPS). WinSCP oder FileZilla sind nicht nötig.

    Was es tut:
      1. npm run audit:content   (Inhalte prüfen)
      2. npm run build           (nach dist/ bauen)
      3. npm run audit:build     (gebaute Seiten prüfen)
      4. dist/ per FTPS in das Webverzeichnis hochladen

    Was es NICHT tut:
      - Es löscht nichts auf dem Server. Dateien werden überschrieben oder
        neu angelegt, nie entfernt. Damit können hochgeladene Kundenfotos
        unter api/_storage/ und die api/config.local.php nicht verloren
        gehen.
      - Es fasst api/_storage/ und api/config.local.php grundsätzlich nicht
        an, selbst wenn sie im Build vorkämen.

.PARAMETER Server
    FTP-Serveradresse aus dem hPanel, z. B. "ftp.schnellhelfer24.de"
    oder die dort angezeigte IP-Adresse.

.PARAMETER Benutzer
    FTP-Benutzername aus dem hPanel, z. B. "u123456789.deploy".

.PARAMETER Zielverzeichnis
    Webverzeichnis auf dem Server. Bei Hostinger üblicherweise
    "/public_html". Bei mehreren Domains eher
    "/domains/schnellhelfer24.de/public_html".

.PARAMETER Probelauf
    Zeigt nur an, was übertragen würde. Es wird nichts hochgeladen.

.PARAMETER OhnePruefung
    Überspringt die Prüfschritte. Nur für Notfälle.

.EXAMPLE
    .\scripts\deploy.ps1 -Server ftp.schnellhelfer24.de -Benutzer u123.deploy -Zielverzeichnis /public_html -Probelauf

.EXAMPLE
    .\scripts\deploy.ps1 -Server ftp.schnellhelfer24.de -Benutzer u123.deploy -Zielverzeichnis /public_html

.NOTES
    Das Passwort wird beim Start abgefragt und nicht gespeichert.
    Es steht damit weder im Skript noch in der PowerShell-Historie.

    Läuft mit Windows PowerShell 5.1 und mit PowerShell 7.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [string] $Server,
    [Parameter(Mandatory = $true)] [string] $Benutzer,
    [string] $Zielverzeichnis = '/public_html',
    [switch] $Probelauf,
    [switch] $OhnePruefung
)

$ErrorActionPreference = 'Stop'

# Projektwurzel ist der Ordner über diesem Skript
$Wurzel = Split-Path -Parent $PSScriptRoot
$Dist = Join-Path $Wurzel 'dist'

function Schritt($text) {
    Write-Host ''
    Write-Host "==> $text" -ForegroundColor Cyan
}

# --------------------------------------------------------------- Bauen
Push-Location $Wurzel
try {
    if (-not $OhnePruefung) {
        Schritt 'Inhalte prüfen'
        npm run audit:content
        if ($LASTEXITCODE -ne 0) { throw 'Die Inhaltsprüfung ist fehlgeschlagen. Es wird nichts übertragen.' }
    }

    Schritt 'Website bauen'
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Der Build ist fehlgeschlagen. Es wird nichts übertragen.' }

    if (-not $OhnePruefung) {
        Schritt 'Gebaute Seiten prüfen'
        npm run audit:build
        if ($LASTEXITCODE -ne 0) { throw 'Die Build-Prüfung ist fehlgeschlagen. Es wird nichts übertragen.' }
    }
}
finally {
    Pop-Location
}

if (-not (Test-Path $Dist)) { throw "Kein dist-Verzeichnis unter $Dist gefunden." }

# ------------------------------------------------------- Zugangsdaten
$SicheresPasswort = Read-Host -Prompt "FTP-Passwort für $Benutzer" -AsSecureString
$Zugang = New-Object System.Net.NetworkCredential($Benutzer, $SicheresPasswort)

# --------------------------------------------------------- Dateiliste
Schritt 'Dateien einsammeln'

# Diese Pfade werden niemals übertragen. api/_storage enthält auf dem
# Server hochgeladene Wohnungsfotos, config.local.php die Empfänger-
# adresse. Beides gehört dem Server, nicht dem Build.
$Ausnahmen = @(
    'api/_storage/',
    'api/config.local.php'
)

$Dateien = Get-ChildItem -Path $Dist -Recurse -File -Force | ForEach-Object {
    $relativ = $_.FullName.Substring($Dist.Length).TrimStart('\', '/').Replace('\', '/')
    [pscustomobject]@{
        Voll     = $_.FullName
        Relativ  = $relativ
        Groesse  = $_.Length
    }
} | Where-Object {
    $pfad = $_.Relativ
    -not ($Ausnahmen | Where-Object { $pfad.StartsWith($_) })
}

$GesamtMb = [math]::Round(($Dateien | Measure-Object -Property Groesse -Sum).Sum / 1MB, 2)
Write-Host ("{0} Dateien, {1} MB" -f $Dateien.Count, $GesamtMb)

if ($Probelauf) {
    Schritt 'Probelauf – es wird nichts übertragen'
    $Dateien | ForEach-Object { Write-Host ("  {0}{1}" -f $Zielverzeichnis.TrimEnd('/'), "/$($_.Relativ)") }
    Write-Host ''
    Write-Host 'Ohne -Probelauf werden diese Dateien hochgeladen.' -ForegroundColor Yellow
    return
}

# ------------------------------------------------------- FTPS-Helfer
function Neue-Anfrage {
    param([string] $Url, [string] $Methode)

    $anfrage = [System.Net.FtpWebRequest]::Create($Url)
    $anfrage.Method = $Methode
    $anfrage.Credentials = $Zugang
    # Explizites TLS. Ohne das würden Passwort und Dateien im Klartext laufen.
    $anfrage.EnableSsl = $true
    $anfrage.UseBinary = $true
    $anfrage.UsePassive = $true
    $anfrage.KeepAlive = $false
    $anfrage.Timeout = 60000
    return $anfrage
}

$Basis = "ftp://$Server" + '/' + $Zielverzeichnis.Trim('/')
$AngelegteOrdner = New-Object 'System.Collections.Generic.HashSet[string]'

function Stelle-OrdnerSicher {
    param([string] $RelativerOrdner)

    if ([string]::IsNullOrWhiteSpace($RelativerOrdner)) { return }
    if ($AngelegteOrdner.Contains($RelativerOrdner)) { return }

    # Erst die übergeordneten Ebenen, dann die tiefere
    $eltern = Split-Path $RelativerOrdner -Parent
    if ($eltern) { Stelle-OrdnerSicher ($eltern.Replace('\', '/')) }

    try {
        $anfrage = Neue-Anfrage "$Basis/$RelativerOrdner" ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
        $antwort = $anfrage.GetResponse()
        $antwort.Close()
    }
    catch [System.Net.WebException] {
        # 550 bedeutet in aller Regel: Ordner gibt es schon. Das ist in Ordnung.
        $status = $_.Exception.Response.StatusDescription
        if ($status -notmatch '550') { throw }
    }

    [void]$AngelegteOrdner.Add($RelativerOrdner)
}

# --------------------------------------------------------- Übertragen
Schritt "Übertragen nach $Server$Zielverzeichnis"

$nummer = 0
$fehler = @()

foreach ($datei in $Dateien) {
    $nummer++
    $ordner = (Split-Path $datei.Relativ -Parent)
    if ($ordner) { Stelle-OrdnerSicher ($ordner.Replace('\', '/')) }

    Write-Progress -Activity 'Übertragung läuft' `
        -Status ("{0} von {1}: {2}" -f $nummer, $Dateien.Count, $datei.Relativ) `
        -PercentComplete (($nummer / $Dateien.Count) * 100)

    try {
        $anfrage = Neue-Anfrage "$Basis/$($datei.Relativ)" ([System.Net.WebRequestMethods+Ftp]::UploadFile)
        $inhalt = [System.IO.File]::ReadAllBytes($datei.Voll)
        $anfrage.ContentLength = $inhalt.Length

        $strom = $anfrage.GetRequestStream()
        $strom.Write($inhalt, 0, $inhalt.Length)
        $strom.Close()

        $antwort = $anfrage.GetResponse()
        $antwort.Close()
    }
    catch {
        $fehler += [pscustomobject]@{ Datei = $datei.Relativ; Meldung = $_.Exception.Message }
        Write-Host ("  FEHLER bei {0}: {1}" -f $datei.Relativ, $_.Exception.Message) -ForegroundColor Red
    }
}

Write-Progress -Activity 'Übertragung läuft' -Completed

# ----------------------------------------------------------- Ergebnis
Write-Host ''
if ($fehler.Count -eq 0) {
    Write-Host ("Fertig. {0} Dateien übertragen." -f $Dateien.Count) -ForegroundColor Green
}
else {
    Write-Host ("{0} von {1} Dateien konnten nicht übertragen werden:" -f $fehler.Count, $Dateien.Count) -ForegroundColor Red
    $fehler | ForEach-Object { Write-Host ("  {0}: {1}" -f $_.Datei, $_.Meldung) }
    exit 1
}

Write-Host ''
Write-Host 'Danach noch prüfen:' -ForegroundColor Yellow
Write-Host '  1. https://schnellhelfer24.de/ im Browser mit Strg+F5 neu laden'
Write-Host '  2. https://schnellhelfer24.de/api/_storage/ muss 403 oder 404 liefern'
Write-Host '  3. Eine Testanfrage über /angebot-anfragen/ senden'
Write-Host '  4. npm run indexnow   (meldet geänderte URLs an Bing)'
