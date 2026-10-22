/** Geometrische Planung für rechteckige Räume; kein Preis- oder Abrechnungsmodell. */
export interface PlanRoom { length: number; width: number; height: number; openings: number; }
export interface AreaPlan { version: 1; createdAt: number; service: 'malerarbeiten-berlin' | 'tapezieren-berlin'; rooms: PlanRoom[]; includeCeiling: boolean; coats: number; coverage: number | null; }
export const PLAN_KEY = 'sh24_area_plan_v1';
export function decimal(raw: string): number {
  const value = raw.trim();
  if (!/^\d+(?:[.,]\d{1,3})?$/.test(value)) throw new Error('Bitte eine positive Zahl mit höchstens drei Nachkommastellen eingeben.');
  return Number(value.replace(',', '.'));
}
function bounded(n: number, min: number, max: number, label: string): number {
  if (typeof n !== 'number' || !Number.isFinite(n) || n < min || n > max) throw new Error(label + ' liegt außerhalb des zulässigen Bereichs.');
  return n;
}
export function calculateAreas(rooms: PlanRoom[]) {
  if (!Array.isArray(rooms) || rooms.length < 1 || rooms.length > 10) throw new Error('Bitte zwischen einem und zehn Räume erfassen.');
  const parts = rooms.map((r, i) => {
    if (!r || typeof r !== 'object') throw new Error('Raumangaben fehlen.');
    const length = bounded(r.length, .5, 100, 'Länge von Raum ' + (i + 1));
    const width = bounded(r.width, .5, 100, 'Breite von Raum ' + (i + 1));
    const height = bounded(r.height, .5, 10, 'Höhe von Raum ' + (i + 1));
    const gross = 2 * (length + width) * height;
    const openings = bounded(r.openings, 0, gross, 'Öffnungsfläche von Raum ' + (i + 1));
    return { gross, net: gross - openings, ceiling: length * width, openings };
  });
  return { parts, gross: parts.reduce((s,r)=>s+r.gross,0), net: parts.reduce((s,r)=>s+r.net,0), ceiling: parts.reduce((s,r)=>s+r.ceiling,0), openings: parts.reduce((s,r)=>s+r.openings,0) };
}
export function paintLitres(area: number, coats: number, coverage: number): number {
  bounded(area, 0, 1e6, 'Fläche');bounded(coats, 1, 3, 'Anstriche');
  if (!Number.isInteger(coats)) throw new Error('Anstriche müssen eine ganze Zahl sein.');
  bounded(coverage, .1, 100, 'Herstellerreichweite');
  return area * coats / coverage;
}
export function readPlan(raw: string | null, now = Date.now()): AreaPlan | null {
  try {
    if (!raw || raw.length > 8000) return null;
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || !Number.isFinite(value.createdAt) || value.createdAt > now + 300000 || now - value.createdAt > 7200000) return null;
    if (!['malerarbeiten-berlin','tapezieren-berlin'].includes(value.service) || typeof value.includeCeiling !== 'boolean') return null;
    calculateAreas(value.rooms);
    bounded(value.coats,1,3,'Anstriche');if(!Number.isInteger(value.coats))return null;
    if(value.coverage !== null)bounded(value.coverage,.1,100,'Reichweite');
    return {version:1,createdAt:value.createdAt,service:value.service,includeCeiling:value.service==='malerarbeiten-berlin' && value.includeCeiling,coats:value.coats,coverage:value.coverage,rooms:value.rooms.map((r:PlanRoom)=>({length:r.length,width:r.width,height:r.height,openings:r.openings}))};
  } catch { return null; }
}
export const planNumber = (n: number) => n.toLocaleString('de-DE',{maximumFractionDigits:2});
export function planDescription(plan: AreaPlan): string {
  const a=calculateAreas(plan.rooms);
  const lines=['Flächenplanung (eigene Maße, vor Ort zu prüfen; kein Abrechnungsaufmaß):'];
  plan.rooms.forEach((r,i)=>lines.push('Raum '+(i+1)+': '+planNumber(r.length)+' × '+planNumber(r.width)+' m, Höhe '+planNumber(r.height)+' m; Öffnungen '+planNumber(r.openings)+' m².'));
  lines.push('Wände brutto '+planNumber(a.gross)+' m²; Öffnungen '+planNumber(a.openings)+' m²; Wände geometrisch netto '+planNumber(a.net)+' m².');
  lines.push(plan.includeCeiling ? 'Decken einbezogen: '+planNumber(a.ceiling)+' m².' : 'Decken nicht angefragt.');
  if(plan.service==='malerarbeiten-berlin' && plan.coverage !== null)lines.push('Materialorientierung: '+plan.coats+' Anstrich(e), Herstellerreichweite '+planNumber(plan.coverage)+' m²/L; rechnerisch '+planNumber(paintLitres(a.net+(plan.includeCeiling?a.ceiling:0),plan.coats,plan.coverage))+' L ohne Reserve.');
  lines.push('Untergrund, Vorbereitung, Material, Auftragnehmer und Preis bitte gesondert klären.');
  return lines.join('\n');
}
