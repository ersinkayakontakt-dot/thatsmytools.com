/**
 * ABLAUF IN DREI SCHRITTEN
 * ========================
 * Eine Quelle für den Ablauf „Zeigen → Klären → Machen". Die Startseite
 * (`src/pages/index.astro`, Abschnitt `.process`) und die Leistungsseiten
 * (`ProcessInline.astro`) lesen beide von hier. Wer den Ablauf ändert,
 * ändert ihn also überall.
 *
 * `finalGeneral` ersetzt den Text des dritten Schritts auf Leistungsseiten:
 * „Wir räumen, transportieren ab" passt auf eine Räumung, nicht auf eine
 * Küchenmontage oder das Verlegen eines Bodens.
 */

export interface ProcessStep {
  nr: string;
  title: string;
  text: string;
}

export const processSteps: ProcessStep[] = [
  {
    nr: '01',
    title: 'Zeigen',
    text: 'Fotos und Eckdaten schicken. Sie erhalten eine kostenlose telefonische Ersteinschätzung; bei Komplettaufträgen sehen wir uns das Objekt vorher an.',
  },
  {
    nr: '02',
    title: 'Klären',
    text: 'Sie erfahren vorab, was gemacht wird, wie lange es dauert und was enthalten ist.',
  },
  {
    nr: '03',
    title: 'Machen',
    text: 'Wir räumen, transportieren ab und übergeben wie vereinbart – auf Wunsch besenrein.',
  },
];

export const finalGeneral =
  'Wir führen aus, was vereinbart ist, und übergeben in dem Zustand, den wir vorher schriftlich festgehalten haben.';
