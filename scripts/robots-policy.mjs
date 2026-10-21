/** robots.txt: spezifische Gruppen ersetzen *, längster Pfad gewinnt, Allow gewinnt Gleichstand. */
export function canCrawl(text, agent, urlPath) {
  const groups = [];
  let group = null;
  for (const line of text.split(/\r?\n/)) {
    const match = line.replace(/#.*$/, '').trim().match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!match) continue;
    const field = match[1].toLowerCase();
    const value = match[2].trim();
    if (field === 'user-agent') {
      if (!group || group.rules.length) { group = { agents: [], rules: [] }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(field) && value) {
      group.rules.push({ allow: field === 'allow', path: value });
    }
  }
  const token = agent.toLowerCase();
  const specificity = (g) => Math.max(-1, ...g.agents.map(a => a === '*' ? 0 : token.includes(a) ? a.length : -1));
  const best = Math.max(-1, ...groups.map(specificity));
  const matches = groups.filter(g => specificity(g) === best).flatMap(g => g.rules).filter(r => {
    const end = r.path.endsWith('$');
    const pattern = (end ? r.path.slice(0, -1) : r.path).split('*').map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    return new RegExp('^' + pattern + (end ? '$' : '')).test(urlPath);
  }).sort((a, b) => b.path.replaceAll('*', '').length - a.path.replaceAll('*', '').length || Number(b.allow) - Number(a.allow));
  return matches[0]?.allow ?? true;
}
