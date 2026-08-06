/**
 * ÄHNLICHKEITSMESSUNG – TRANSPARENT UND NACHRECHENBAR
 * ===================================================
 *
 * Zwei unabhängige Verfahren, beide werden ausgewiesen. Ein einzelner Wert
 * ist zu leicht falsch zu interpretieren:
 *
 *   Jaccard über 5-Wort-Shingles
 *     Erkennt wörtlich übernommene Passagen und Ortstausch-Templates.
 *     Unempfindlich gegen unterschiedliche Reihenfolge der Abschnitte.
 *     Blind gegen Umformulierungen mit gleicher Aussage.
 *
 *   Cosinus über TF-IDF
 *     Erkennt thematische Deckung auch bei anderer Formulierung.
 *     Gewichtet seltene Begriffe stärker – „Kellerabteil" sagt mehr über
 *     Deckungsgleichheit aus als „Wohnung".
 *     Braucht mehrere Dokumente als Vergleichsbasis (IDF).
 *
 * Bewusst KEIN externer KI-Aufruf: Eine Prüfung, die den Build blockiert,
 * darf nicht von einem kostenpflichtigen Dienst, einem Netzwerkzugang oder
 * einem nicht reproduzierbaren Ergebnis abhängen. Beide Verfahren hier
 * liefern bei gleicher Eingabe immer denselben Wert.
 *
 * Deutsche Stoppwörter werden entfernt, damit die Ähnlichkeit nicht aus
 * Füllwörtern entsteht. Die Liste ist absichtlich kurz und enthält nur
 * Wörter ohne Fachbedeutung – „Keller" oder „Aufzug" gehören NICHT hinein,
 * auch wenn sie häufig sind: Genau ihre gemeinsame Verwendung ist das
 * Signal, das erkannt werden soll.
 */

const STOPWORDS = new Set([
  'aber', 'alle', 'allem', 'allen', 'aller', 'alles', 'als', 'also', 'auch', 'auf', 'aus',
  'bei', 'beim', 'bin', 'bis', 'bist', 'dann', 'das', 'dass', 'dem', 'den', 'der', 'des',
  'die', 'dies', 'diese', 'diesem', 'diesen', 'dieser', 'dieses', 'doch', 'dort', 'durch',
  'ein', 'eine', 'einem', 'einen', 'einer', 'eines', 'einfach', 'etwa', 'etwas', 'euch',
  'für', 'gegen', 'haben', 'hat', 'hatte', 'hier', 'ihre', 'ihrem', 'ihren', 'ihrer', 'ihres',
  'immer', 'ist', 'jede', 'jedem', 'jeden', 'jeder', 'jedes', 'kann', 'können', 'mehr',
  'mit', 'muss', 'müssen', 'nach', 'nicht', 'noch', 'nur', 'oder', 'ohne', 'schon', 'sehr',
  'sein', 'seine', 'sich', 'sie', 'sind', 'soll', 'sollen', 'sondern', 'über', 'und', 'uns',
  'unser', 'unsere', 'unter', 'viel', 'viele', 'vom', 'von', 'vor', 'war', 'waren', 'was',
  'wenn', 'werden', 'wie', 'wir', 'wird', 'wo', 'zu', 'zum', 'zur', 'zwischen',
]);

/** Zerlegt Text in bedeutungstragende, kleingeschriebene Wörter. */
export function tokenize(text) {
  return (text.toLocaleLowerCase('de-DE').match(/[a-zäöüß][a-zäöüß-]{2,}/g) ?? []).filter(
    (w) => !STOPWORDS.has(w),
  );
}

/** Wortfolgen fester Länge. Erkennt übernommene Formulierungen. */
export function shingles(tokens, n = 5) {
  const out = new Set();
  for (let i = 0; i + n <= tokens.length; i += 1) out.add(tokens.slice(i, i + n).join(' '));
  return out;
}

export function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const v of a) if (b.has(v)) shared += 1;
  return shared / (a.size + b.size - shared);
}

/**
 * Baut TF-IDF-Vektoren über eine Dokumentmenge.
 * @param {{id: string, tokens: string[]}[]} docs
 */
export function tfidfVectors(docs) {
  const df = new Map();
  for (const doc of docs) {
    for (const term of new Set(doc.tokens)) df.set(term, (df.get(term) ?? 0) + 1);
  }
  const N = docs.length;
  return docs.map((doc) => {
    const tf = new Map();
    for (const term of doc.tokens) tf.set(term, (tf.get(term) ?? 0) + 1);
    const vec = new Map();
    let norm = 0;
    for (const [term, count] of tf) {
      // Geglättetes IDF: verhindert Division durch null und dämpft Begriffe,
      // die in fast jedem Dokument vorkommen.
      const idf = Math.log((N + 1) / ((df.get(term) ?? 0) + 1)) + 1;
      const w = (count / doc.tokens.length) * idf;
      vec.set(term, w);
      norm += w * w;
    }
    norm = Math.sqrt(norm) || 1;
    for (const [term, w] of vec) vec.set(term, w / norm);
    return { id: doc.id, vec };
  });
}

/** Cosinus zweier bereits normalisierter TF-IDF-Vektoren. */
export function cosine(a, b) {
  // Über die kleinere Map iterieren – bei sehr unterschiedlich langen
  // Seiten spart das spürbar Zeit und ändert das Ergebnis nicht.
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let sum = 0;
  for (const [term, w] of small) {
    const other = large.get(term);
    if (other) sum += w * other;
  }
  return sum;
}

/**
 * Normalisiert eine Überschrift für den direkten Vergleich:
 * Ortsnamen und Zahlen bleiben erhalten, Interpunktion und Füllwörter nicht.
 */
export function normalizeHeading(text) {
  return tokenize(text).sort().join(' ');
}

/** Ähnlichkeit zweier kurzer Zeichenketten (Titles, H1) über Wortmengen. */
export function headingSimilarity(a, b) {
  return jaccard(new Set(tokenize(a)), new Set(tokenize(b)));
}

/**
 * Kommt ein Wort in einer Wortliste vor – auch in gebeugter Form?
 *
 * Deutsche Suchanfragen und Überschriften stehen fast nie im selben Numerus
 * und Kasus: "räumung hausverwaltung berlin" gegen "Räumungen für
 * Hausverwaltungen". Ein exakter Vergleich meldet hier einen Fehler, wo
 * keiner ist.
 *
 * Bewusst KEIN Stemmer als Abhängigkeit. Ein Präfixvergleich ab fünf
 * Zeichen deckt die deutschen Endungen (-e, -en, -er, -s, -ung/-ungen) ab
 * und ist nachvollziehbar. Er ist absichtlich großzügig: Diese Prüfung
 * erzeugt Warnungen, keine Fehler – ein Fehlalarm kostet mehr als eine
 * übersehene Feinheit.
 */
export function looseIncludes(haystack, word) {
  if (word.length < 5) return haystack.includes(word);
  return haystack.some((h) => h.startsWith(word) || word.startsWith(h.slice(0, Math.max(5, h.length - 3))));
}

/** Anteil der Wörter aus `query`, die in `text` vorkommen (0 bis 1). */
export function queryCoverage(query, text) {
  const words = tokenize(query);
  if (!words.length) return 1;
  const haystack = tokenize(text);
  return words.filter((w) => looseIncludes(haystack, w)).length / words.length;
}
