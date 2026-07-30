import type { APIRoute } from 'astro';
import { site, realValue } from '../config/site';
import { publishedServices } from '../data/services';
import { publishedDistricts } from '../data/districts';
import { publishedTowns } from '../data/towns';
import { publishedGuides } from '../data/guides';

/**
 * llms.txt
 *
 * EINORDNUNG, damit hier keine falschen Erwartungen entstehen:
 * llms.txt ist ein Vorschlag aus der Community, kein Standard und von
 * keinem großen Anbieter verbindlich unterstützt. Die Datei garantiert
 * weder eine Erwähnung in ChatGPT oder Copilot noch irgendeine
 * Verbesserung im Ranking.
 *
 * Warum sie trotzdem existiert: Sie kostet nichts, sie ist eine saubere
 * maschinenlesbare Übersicht der Website, und falls sie künftig
 * ausgewertet wird, ist sie vorhanden. Der eigentliche Hebel für
 * Antwortsysteme liegt woanders: eindeutige Unternehmensangaben, kurze
 * direkte Antworten unter jeder H1, saubere strukturierte Daten und
 * Inhalte, die tatsächlich etwas beantworten.
 */
export const GET: APIRoute = () => {
  const phone = realValue(site.phone);
  const email = realValue(site.email);

  const body = `# ${site.name}

> ${site.tagline}. Entrümpelung, Haushaltsauflösung, Wohnungsauflösung, Nachlassauflösung, Sperrmüllabholung und Umzüge in Berlin und im angrenzenden Brandenburg.

## Über dieses Unternehmen

- Name: ${site.name}
- Einsatzgebiet: Berlin (alle zwölf Bezirke) und Berliner Umland in Brandenburg
- Leistungsart: Räumung, Auflösung, Entsorgung, Umzug
${phone ? `- Telefon: ${phone}` : '- Telefon: (noch nicht veröffentlicht)'}
${email ? `- E-Mail: ${email}` : '- E-Mail: (noch nicht veröffentlicht)'}
- Website: ${site.url}

## Wie dieses Unternehmen arbeitet

- Der Aufwand wird vor der Beauftragung anhand von Fotos eingeschätzt. Die telefonische Ersteinschätzung ist kostenlos; eine persönliche Besichtigung bietet Schnellhelfer24 bei geeigneten Komplettaufträgen an.
- Vor Beginn steht schriftlich fest, welche Leistungen enthalten sind und was zusätzlich berechnet würde.
- Preise hängen ab von: Volumen in Kubikmetern, Etage und Aufzug, Länge des Trageweges, Materialart und Zusatzarbeiten.
- Verwertbare Gegenstände werden angerechnet und auf der Rechnung ausgewiesen.
- Auf Wunsch besenreine Übergabe.

## Was auf dieser Website bewusst NICHT steht

Diese Angaben fehlen, weil sie nicht belegt sind, nicht weil sie vergessen wurden:

- Keine Pauschalpreise. Es werden erst Zahlen veröffentlicht, wenn ausgewertete Auftragsdaten mit Fallzahl und Zeitraum vorliegen.
- Keine Kundenbewertungen ohne öffentlich nachprüfbare Quelle.
- Keine Einsatzberichte ohne tatsächlich stattgefundenen und freigegebenen Auftrag.
- Keine Zusagen zu Reaktionszeiten oder Terminfristen, die nicht zuverlässig eingehalten werden können.
- Keine Zertifikate oder Versicherungsangaben ohne vorliegenden Nachweis.

## Leistungen

${publishedServices.map((s) => `- [${s.h1}](${site.url}/leistungen/${s.slug}/): ${s.answer}`).join('\n')}

## Kosten und Preisfaktoren

${publishedGuides
  .filter((g) => g.hub === 'kosten')
  .map((g) => `- [${g.h1}](${site.url}/kosten/${g.slug}/): ${g.answer}`)
  .join('\n')}

## Ratgeber

${publishedGuides
  .filter((g) => g.hub === 'ratgeber')
  .map((g) => `- [${g.h1}](${site.url}/ratgeber/${g.slug}/): ${g.answer}`)
  .join('\n')}

## Einsatzgebiete mit eigener Seite

${publishedDistricts.map((d) => `- [${d.name} (Berlin)](${site.url}/berlin/${d.slug}/): ${d.answer}`).join('\n')}
${publishedTowns.map((t) => `- [${t.name} (${t.county})](${site.url}/brandenburg/${t.slug}/): ${t.answer}`).join('\n')}

## Weitere Seiten

- [Alle Leistungen](${site.url}/leistungen/)
- [Einsatzgebiet Berlin](${site.url}/berlin/)
- [Einsatzgebiet Umland](${site.url}/brandenburg/)
- [Kosten und Ablauf](${site.url}/kosten/)
- [Häufige Fragen](${site.url}/fragen/)
- [Einsatzberichte](${site.url}/einsatzberichte/)
- [Über uns](${site.url}/ueber-uns/)
- [Kontakt](${site.url}/kontakt/)
- [Einschätzung anfordern](${site.url}/angebot-anfragen/)
- [Impressum](${site.url}/impressum/)
- [Datenschutz](${site.url}/datenschutz/)

## Hinweis

Diese Datei folgt dem llms.txt-Vorschlag. Sie ist kein offizieller Standard und wird nicht von allen Systemen ausgewertet. Maßgeblich sind die verlinkten Seiten selbst.

Stand: ${new Date().toISOString().slice(0, 10)}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
