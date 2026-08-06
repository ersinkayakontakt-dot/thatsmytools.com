/**
 * ACCESS-LOGS EINLESEN
 * ====================
 *
 * Versteht die beiden Formate, die auf Webhosting tatsächlich vorkommen:
 *
 *   Combined (Apache und Nginx voreingestellt)
 *     1.2.3.4 - - [10/Aug/2026:04:12:33 +0200] "GET /kontakt/ HTTP/1.1" 200 5123 "-" "Mozilla/5.0 …"
 *
 *   Common (ohne Referrer und User-Agent)
 *     1.2.3.4 - - [10/Aug/2026:04:12:33 +0200] "GET /kontakt/ HTTP/1.1" 200 5123
 *
 * Zusätzlich vertragen: ein vorangestellter virtueller Host (manche
 * Hoster schreiben ihn davor), Gedankenstriche für fehlende Werte,
 * Anführungszeichen innerhalb von User-Agents.
 *
 * DATENSCHUTZ AN DER QUELLE
 * Die IP-Adresse wird beim Einlesen SOFORT gekürzt und nie vollständig
 * zurückgegeben. Nicht später beim Bericht, sondern hier – damit sie
 * gar nicht erst durch das Programm wandert und versehentlich in einer
 * Zwischendatei landen kann.
 *
 *   IPv4  letztes Oktett auf 0        1.2.3.4     -> 1.2.3.0
 *   IPv6  nur die ersten drei Blöcke  2a01:db8:1:… -> 2a01:db8:1::
 *
 * Für die Bot-Verifikation per Reverse-DNS wird die volle Adresse
 * gebraucht. Sie wird deshalb ausschließlich innerhalb eines Laufs im
 * Arbeitsspeicher gehalten und niemals geschrieben – siehe `rawIp`.
 */

/**
 * Combined-Log-Format.
 *
 * Absichtlich nicht ein einziger großer Ausdruck: Ein Log mit einem
 * unerwarteten Feld soll erkennbar scheitern, nicht stillschweigend die
 * falschen Spalten liefern.
 */
const LINE = new RegExp(
  [
    '^(?:\\S+\\s+)?', //  optionaler virtueller Host
    '(\\S+)', //           1 IP-Adresse
    '\\s+\\S+\\s+\\S+', //   Identität und Benutzer (fast immer "-")
    '\\s+\\[([^\\]]+)\\]', // 2 Zeitstempel
    '\\s+"([A-Z]+)\\s+(\\S+)[^"]*"', // 3 Methode, 4 Pfad
    '\\s+(\\d{3})', //     5 Statuscode
    '\\s+(\\d+|-)', //     6 Größe
    '(?:\\s+"([^"]*)")?', // 7 Referrer
    '(?:\\s+"(.*)")?', //  8 User-Agent (kann Anführungszeichen enthalten)
  ].join(''),
);

const MONTHS = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

/** "10/Aug/2026:04:12:33 +0200" -> "2026-08-10" */
function toDate(stamp) {
  const m = String(stamp).match(/^(\d{2})\/(\w{3})\/(\d{4}):/);
  if (!m) return '';
  return `${m[3]}-${MONTHS[m[2]] ?? '01'}-${m[1]}`;
}

/** "10/Aug/2026:04:12:33 +0200" -> Stunde als Zahl */
function toHour(stamp) {
  const m = String(stamp).match(/:(\d{2}):\d{2}:\d{2}/);
  return m ? Number(m[1]) : 0;
}

/**
 * Kürzt eine IP-Adresse unwiderruflich.
 * Für die Auswertung genügt das vollkommen: Gefragt ist, ob mehrere
 * Zugriffe aus demselben Netz kommen, nicht von wem.
 */
export function truncateIp(ip) {
  if (!ip || ip === '-') return '';
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts.slice(0, 3).join(':') + '::';
  }
  const parts = ip.split('.');
  if (parts.length !== 4) return '';
  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

/**
 * Liest eine einzelne Zeile.
 * @returns {object|null} null bei nicht erkennbarer Zeile
 */
export function parseLine(line) {
  const m = line.match(LINE);
  if (!m) return null;

  const [, ip, stamp, method, rawPath, status, size, referrer, userAgent] = m;

  // Pfad ohne Query-String und ohne Protokoll/Host. Query-Strings in
  // Logs enthalten regelmäßig personenbezogene Parameter.
  const withoutHost = rawPath.replace(/^https?:\/\/[^/]+/i, '');
  const [path, query] = withoutHost.split('?');

  return {
    ip: truncateIp(ip),
    /** Vollständige Adresse – NUR für die optionale DNS-Verifikation,
     *  wird niemals geschrieben oder ausgegeben. */
    rawIp: ip,
    date: toDate(stamp),
    hour: toHour(stamp),
    method,
    path: path || '/',
    /** Nur ob Parameter da waren, nicht welche. */
    hasQuery: Boolean(query),
    status: Number(status),
    bytes: size === '-' ? 0 : Number(size),
    referrer: referrer && referrer !== '-' ? referrer : '',
    userAgent: userAgent && userAgent !== '-' ? userAgent : '',
  };
}

/**
 * BOT-ERKENNUNG
 * =============
 *
 * Ein User-Agent ist eine Behauptung, kein Nachweis. Jeder kann sich
 * „Googlebot" nennen – und viele tun es, um Sperren zu umgehen. Deshalb
 * werden drei Stufen unterschieden und im Bericht auch so benannt:
 *
 *   erkannt              Der User-Agent nennt diesen Bot.
 *   technisch verifiziert Reverse-DNS und anschließendes Forward-Lookup
 *                        bestätigen die Herkunft.
 *   nicht verifiziert    Die Prüfung ist fehlgeschlagen oder wurde nicht
 *                        durchgeführt.
 *
 * Eine Auswertung, die alle drei Stufen in einen Topf wirft, führt zu
 * falschen Schlüssen – etwa „Googlebot crawlt uns 5000-mal am Tag",
 * wenn es in Wahrheit ein Scraper mit fremdem Namensschild ist.
 */
const BOTS = [
  {
    id: 'Googlebot',
    pattern: /Googlebot|Google-InspectionTool|Storebot-Google/i,
    /** Hostnamen, auf die ein echter Googlebot per Reverse-DNS auflöst. */
    hosts: [/\.googlebot\.com$/i, /\.google\.com$/i],
    purpose: 'Google-Suchindex',
  },
  {
    id: 'Bingbot',
    pattern: /bingbot|adidxbot|BingPreview/i,
    hosts: [/\.search\.msn\.com$/i],
    purpose: 'Bing-Suchindex – Grundlage für Copilot und ChatGPT Search',
  },
  {
    id: 'OAI-SearchBot',
    pattern: /OAI-SearchBot/i,
    hosts: [],
    purpose: 'ChatGPT Search – sorgt dafür, dass die Seite dort zitiert werden kann',
  },
  {
    id: 'ChatGPT-User',
    pattern: /ChatGPT-User/i,
    hosts: [],
    purpose: 'Abruf im Auftrag eines Menschen im Gespräch',
  },
  {
    id: 'GPTBot',
    pattern: /GPTBot/i,
    hosts: [],
    purpose: 'Trainingsdaten – in robots.txt bewusst gesperrt',
  },
  {
    id: 'ClaudeBot',
    pattern: /ClaudeBot/i,
    hosts: [],
    purpose: 'Trainingsdaten – in robots.txt bewusst gesperrt',
  },
  {
    id: 'Claude-SearchBot',
    pattern: /Claude-SearchBot|Claude-User/i,
    hosts: [],
    purpose: 'Claude-Suche und Abruf im Auftrag eines Menschen',
  },
  {
    id: 'PerplexityBot',
    pattern: /PerplexityBot|Perplexity-User/i,
    hosts: [],
    purpose: 'Perplexity-Antworten',
  },
  {
    id: 'Applebot',
    pattern: /Applebot/i,
    hosts: [/\.applebot\.apple\.com$/i],
    purpose: 'Siri und Spotlight',
  },
  {
    id: 'DuckAssistBot',
    pattern: /DuckAssistBot|DuckDuckBot/i,
    hosts: [],
    purpose: 'DuckDuckGo',
  },
  {
    id: 'Yandex',
    pattern: /YandexBot/i,
    hosts: [/\.yandex\.(ru|com|net)$/i],
    purpose: 'Yandex-Suchindex',
  },
  {
    id: 'SEO-Werkzeug',
    pattern: /AhrefsBot|SemrushBot|MJ12bot|DotBot|DataForSeoBot|BLEXBot/i,
    hosts: [],
    purpose: 'Analysewerkzeug Dritter – kostet Crawl-Budget ohne Gegenwert',
  },
  {
    id: 'Meta',
    pattern: /meta-externalagent|facebookexternalhit/i,
    hosts: [],
    purpose: 'Meta – Trainingssammler in robots.txt gesperrt',
  },
];

/** Bekannte Browser-Kennungen. Grob, aber ausreichend zur Abgrenzung. */
const HUMAN = /Mozilla\/5\.0 \((?:Windows|Macintosh|X11|iPhone|iPad|Android|Linux)/i;

/**
 * Ordnet einen User-Agent zu.
 * @returns {{type: 'bot'|'mensch'|'unbekannt', id: string, purpose?: string, def?: object}}
 */
export function classify(userAgent) {
  if (!userAgent) return { type: 'unbekannt', id: 'ohne Kennung' };

  for (const bot of BOTS) {
    if (bot.pattern.test(userAgent)) {
      return { type: 'bot', id: bot.id, purpose: bot.purpose, def: bot };
    }
  }

  // Allgemeine Bot-Merkmale nach den benannten prüfen, sonst würde ein
  // „Googlebot" mit dem Wort „bot" hier landen statt oben.
  if (/bot|crawler|spider|scraper|curl|wget|python-requests|okhttp|java\//i.test(userAgent)) {
    return { type: 'bot', id: 'unbekannter Bot' };
  }

  if (HUMAN.test(userAgent)) return { type: 'mensch', id: 'Browser' };

  return { type: 'unbekannt', id: 'nicht zuzuordnen' };
}

export { BOTS };
