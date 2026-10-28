# Checkliste: Profile und Verzeichnisse anlegen

Stand 28.10.2026 · gehört zu `docs/WACHSTUMSPLAN-ANFRAGEN.md` § 3.1–3.3

Alle Werte (Name, Anschrift, Telefon, Beschreibung, Leistungen, Links mit
Kennung) **aus `docs/EINTRAGS-KIT.md` kopieren, nie abtippen.** Nach jedem
fertigen Profil die öffentliche Profil-URL melden – ich trage sie in
`src/config/site.ts` → `profiles` ein (wird zu `sameAs` im Schema).

Anmeldewege per Websuche am 28.10.2026 ermittelt; die Portale selbst waren
aus der Arbeitsumgebung nicht abrufbar. Oberflächen ändern sich – im Zweifel
gilt, was das Portal anzeigt.

> **Vorsicht vor Branchenbuch-Abzocke.** Formulare per Fax oder Post, die
> wie „Gelbe Seiten“ oder „Das Örtliche“ aussehen und einen „Eintrag“
> bestätigen lassen, sind oft teure Verträge (Warnung der Polizei
> Oberfranken und des ZDH). Nur über die unten genannten Websites eintragen,
> nichts Zugeschicktes unterschreiben. Kostenlose Testpakete (z. B. bei
> Sellwerk) nur mit gelesenem Kleingedrucktem.

---

## Stufe 1 – Karten und Suche (zuerst, zusammen etwa 1 Stunde)

| ✓ | Portal | Wo | Was beachten | Link mit Kennung (aus Kit) |
|---|---|---|---|---|
| [ ] | **Google-Unternehmensprofil** (besteht) | business.google.com | Beschreibung und Dienstleistungen aus dem Kit übernehmen; Website-Link durch den Link mit Kennung ersetzen; „Angebot/Termin“-Link setzen; Bewertungslink erzeugen („Mehr Rezensionen erhalten“) und melden → `site.reviewLink` | `utm_source=google&utm_medium=profile` |
| [ ] | **Bing Places** | bing.com/forbusiness (neue Oberfläche seit Okt. 2025) | Mit Microsoft-Konto anmelden, „Import aus Google“ wählen. Ein verifiziertes Google-Profil wird laut Drittquellen meist ohne eigene Prüfung übernommen; Veröffentlichung dauert etwa 1–2 Wochen. **Kategorien nach dem Import von Hand setzen** – Bing übernimmt sie nicht. Website-Link nach dem Import auf die Bing-Kennung ändern. Automatische Synchronisierung nur einschalten, wenn der Link mit Kennung danach erhalten bleibt | `utm_source=bing&utm_medium=profile` |
| [ ] | **Bing Webmaster Tools** | bing.com/webmasters | Website bestätigen, Sitemap `https://schnellhelfer24.de/sitemap.xml` einreichen | – |
| [ ] | **Apple Business Connect** | businessconnect.apple.com | Mit Apple-Account anmelden → Unternehmen → Standorte → Hinzufügen. Existiert der Ort schon, Übertragung beantragen. Bestätigungsmails von apple.com dürfen nicht im Spam landen | `utm_source=apple&utm_medium=profile` |

## Stufe 2 – Verzeichnisse mit Bewertungen

Nur der kostenlose Grundeintrag. Bezahlpakete sind für die Nennung nicht
nötig.

| ✓ | Verzeichnis | Wo | Was beachten | Kennung |
|---|---|---|---|---|
| [ ] | **Gelbe Seiten** | gelbeseiten.de/starteintrag | Kostenloser Grundeintrag; der Verlag prüft vor Veröffentlichung | `gelbeseiten` |
| [ ] | **Das Örtliche** | über dasoertliche.de bzw. den zuständigen Verlag | Grundeintrag kostenlos, baut oft auf dem Telefonbucheintrag auf; Anschrift nötig | `dasoertliche` |
| [ ] | **11880** | 11880.com | Erst suchen, ob der Betrieb schon gelistet ist; sonst kostenlos anlegen. Den „Angebotsservice“ (Leads) nur bewusst aktivieren – dann Kanal `portal` statt `directory` | `elf1880` |
| [ ] | **golocal** | golocal.de/unternehmen | Eintrag suchen und übernehmen („Location Claim“), Mitgliedschaft kostenlos | `golocal` |
| [ ] | **KennstDuEinen** | kennstdueinen.de | Firma kostenlos eintragen, danach Profil übernehmen | `kennstdueinen` |
| [ ] | **werkenntdenBESTEN** | werkenntdenbesten.de | Anmeldeweg nicht ermittelt – auf der Seite nach „Firma eintragen“ suchen | `wkdb` |
| [ ] | **Cylex** | cylex.de | **Bestehenden Eintrag korrigieren** (Hausnummer, LOCAL-2026-01): Korrekturentwurf steht in `docs/SEO-AUSBAU-2026-10-22.md`. Basiseintrag ist kostenlos; keine Upgrade-Pakete nötig | `cylex` |
| [ ] | **Yelp** | biz.yelp.de | Unternehmen beanspruchen oder anlegen | `yelp` |
| [ ] | **OpenStreetMap** | openstreetmap.org | Nur, wenn die Anschrift öffentlich sein darf (`hasVisitableAddress`). Solange `false`: auslassen | – |

Die Spalte „Kennung“ ist der Wert für `utm_source`; `utm_medium` ist immer
`directory`. Fertige Links: `docs/EINTRAGS-KIT.md` § Links mit Kennung.

## Stufe 3 – Portale (Test mit Budgetdeckel, siehe Wachstumsplan § 3.4)

| ✓ | Portal | Kennung | Medium |
|---|---|---|---|
| [ ] | MyHammer | `myhammer` | `portal` |
| [ ] | Check24 Profis | `check24` | `portal` |

Nur **eines** gleichzeitig, 8 Wochen, fester Monatsdeckel. Anfragen, die
direkt im Portal eingehen (nicht über die Website), im Betriebsbereich
nicht erfassbar – deren Zahl im Portal-Dashboard ablesen und notieren.

---

## Nach jedem Eintrag

1. Angaben gegen `docs/EINTRAGS-KIT.md` Zeichen für Zeichen vergleichen
   (Name, Hausnummer, Telefon, Schreibweise der Domain).
2. Öffentliche Profil-URL notieren und melden.
3. Einen Kalendereintrag in vier Wochen: Ist der Eintrag sichtbar und noch
   richtig?

## Später (nicht jetzt)

- Branchenspezifische Verbände oder Innungen: nur mit echter Mitgliedschaft.
- Lokale Presse / Bezirksportale: erst, wenn es einen echten Anlass gibt
  (z. B. veröffentlichbarer Einsatzbericht).
