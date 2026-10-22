import {PLAN_KEY,readPlan,planDescription,calculateAreas,planNumber} from '../lib/areaPlan';
const form=document.querySelector<HTMLFormElement>('[data-form]');
if(form && new URLSearchParams(location.search).get('planung')==='flaechen'){
 let raw:string|null=null;try{raw=sessionStorage.getItem(PLAN_KEY);}catch{/* ohne lokalen Speicher normale Anfrage */}
 const plan=readPlan(raw);
 if(plan){
  const banner=document.createElement('section');banner.className='plan-transfer';banner.setAttribute('aria-label','Ihre Flächenplanung');
  const title=document.createElement('h2');title.textContent='Ihre Maße sind dabei.';const text=document.createElement('p');text.textContent='Sie können die Flächenplanung in Ihre Beschreibung übernehmen. Bereits eingegebene Texte bleiben erhalten.';
  const button=document.createElement('button');button.type='button';button.className='btn btn--primary';button.textContent='Flächenplan übernehmen';const dismiss=document.createElement('button');dismiss.type='button';dismiss.className='btn btn--ghost';dismiss.textContent='Ohne Plan fortfahren';const feedback=document.createElement('p');feedback.setAttribute('role','status');
  banner.append(title,text,button,dismiss,feedback);form.before(banner);
  dismiss.addEventListener('click',()=>{try{sessionStorage.removeItem(PLAN_KEY);}catch{}banner.remove();});
  button.addEventListener('click',()=>{
   const selected=form.querySelector<HTMLInputElement>('input[name="leistung"]:checked');
   if(selected?.dataset.serviceSlug!==plan.service){feedback.textContent='Bitte wählen Sie zuerst die im Plan vorgesehene Leistung: '+(plan.service==='malerarbeiten-berlin'?'Malerarbeiten.':'Tapezieren.');return;}
   const description=form.querySelector<HTMLTextAreaElement>('#beschreibung')!;const addition=planDescription(plan);const combined=[description.value.trim(),addition].filter(Boolean).join('\n\n');
   if(combined.length>description.maxLength){feedback.textContent='Für den Plan ist in Ihrer Beschreibung nicht genug Platz. Bitte kürzen Sie Ihren vorhandenen Text oder fahren Sie ohne Übernahme fort.';return;}
   description.value=combined;description.dispatchEvent(new Event('input',{bubbles:true}));
   const area=form.querySelector<HTMLInputElement>('#flaeche')!;const a=calculateAreas(plan.rooms);if(!area.value.trim()){area.value='Wände netto '+planNumber(a.net)+' m²'+(plan.includeCeiling?'; Decken '+planNumber(a.ceiling)+' m²':'');area.dispatchEvent(new Event('input',{bubbles:true}));}
   try{sessionStorage.removeItem(PLAN_KEY);}catch{}
   (window as Window & {sh24?:{track:(n:string,d:object)=>void}}).sh24?.track('area_plan_transferred',{location:'anfrage-flaechenplan'});
   button.disabled=true;dismiss.hidden=true;feedback.textContent='Plan übernommen. Prüfen Sie ihn im letzten Schritt vor dem Absenden. Vorhandene Flächenangaben wurden beibehalten.';
  });
 }
}
