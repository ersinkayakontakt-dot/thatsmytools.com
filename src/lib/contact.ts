import { site, realValue, telHref, whatsappHref } from '../config/site';

/**
 * Aufbereitete Kontaktwege.
 *
 * Solange in src/config/site.ts noch Platzhalter stehen, ist `available`
 * false. Komponenten zeigen dann keinen toten Link, sondern führen zum
 * Anfrageformular. So sieht die Seite auch vor dem Eintragen der echten
 * Daten nicht kaputt aus – und es entsteht keine falsche Angabe.
 */

const waText =
  'Hallo, ich interessiere mich für Ihre Dienstleistungen und möchte mein Vorhaben mit Ihnen besprechen.';

export const phone = {
  available: Boolean(realValue(site.phone)),
  display: realValue(site.phoneDisplay) ?? realValue(site.phone) ?? 'Telefonnummer folgt',
  href: telHref(site.phone),
};

export const whatsapp = {
  available: Boolean(realValue(site.whatsapp)),
  href: whatsappHref(site.whatsapp, waText),
};

export const email = {
  available: Boolean(realValue(site.email)),
  address: realValue(site.email) ?? '',
  href: realValue(site.email) ? `mailto:${realValue(site.email)}` : '',
};

/** Primärer Handlungsaufruf: immer verfügbar, führt zum Aufwand-Check. */
export const primaryCta = {
  href: '/angebot-anfragen/',
  label: 'Vorhaben unverbindlich anfragen',
  labelShort: 'Projekt anfragen',
};
