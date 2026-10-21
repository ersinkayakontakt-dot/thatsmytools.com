/** Local integration test: synthetic requests, private temporary storage, loopback SMTP only. */
import {createServer} from 'node:net';
import {spawn,spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,cpSync,writeFileSync,readdirSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
import {site} from '../src/config/site.ts';
const phpCandidate=['php',join(process.env.LOCALAPPDATA||'','Microsoft/WinGet/Packages/PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe/php.exe')].find(p=>spawnSync(p,['-r','echo 1;']).status===0);
assert.ok(phpCandidate,'PHP 8 required');
const php=spawnSync(phpCandidate,['-r','echo PHP_BINARY;'],{encoding:'utf8'}).stdout.trim();
const root=resolve(import.meta.dirname,'..');
const endpoint=readFileSync(join(root,'public/api/anfrage.php'),'utf8');
for(const field of ['recipient','from']){const line=endpoint.split(/\r?\n/).find(l=>l.trim().startsWith("'"+field+"'"));assert.equal(line?.match(/=>\s*'([^']+)'/)?.[1],site.email,'Public PHP contact must match central site.email');}
const dir=mkdtempSync(join(tmpdir(),'sh24-request-'));
const web=join(dir,'site');mkdirSync(web);cpSync(join(root,'public/api'),join(web,'api'),{recursive:true,filter:p=>!p.includes('_storage')&&!p.endsWith('config.local.php')});
const storage=join(dir,'private');let rejectMail=false,mailCount=0;
const smtp=createServer(socket=>{socket.on('error',()=>{});socket.setEncoding('utf8');socket.write('220 local-test\r\n');let buffer='',data=false,auth=0;socket.on('data',chunk=>{buffer+=chunk;let n;while((n=buffer.indexOf('\r\n'))>=0){const line=buffer.slice(0,n);buffer=buffer.slice(n+2);if(data){if(line==='.'){data=false;mailCount++;socket.write('250 saved\r\n');}continue;}if(auth){socket.write(auth++===1?'334 password\r\n':'235 ok\r\n');if(auth===3)auth=0;continue;}if(line.startsWith('EHLO'))socket.write('250-local\r\n250 AUTH LOGIN\r\n');else if(line==='AUTH LOGIN'){auth=1;socket.write('334 username\r\n');}else if(line.startsWith('RCPT'))socket.write(rejectMail?'550 rejected\r\n':'250 ok\r\n');else if(line==='DATA'){data=true;socket.write('354 send\r\n');}else if(line==='QUIT'){socket.end('221 bye\r\n');}else socket.write('250 ok\r\n');}});});
await new Promise(r=>smtp.listen(0,'127.0.0.1',r));
const portProbe=createServer();await new Promise(r=>portProbe.listen(0,'127.0.0.1',r));const port=portProbe.address().port;await new Promise(r=>portProbe.close(r));
const config={recipient:'recipient@example.test',from:'sender@example.test',smtpUser:'sender@example.test',smtpPass:'synthetic-test-only',smtpHost:'127.0.0.1',smtpPort:smtp.address().port,smtpSecure:'none',smtpTimeout:2,storageDir:storage,siteUrl:'http://127.0.0.1:'+port,rateMax:100,minFillMs:0};
writeFileSync(join(web,'api/config.local.php'),'<?php return json_decode(base64_decode(\''+Buffer.from(JSON.stringify(config)).toString('base64')+'\'),true);');
const server=spawn(php,['-d','extension_dir='+join(dirname(php),'ext'),'-d','extension=mbstring','-d','extension=fileinfo','-S','127.0.0.1:'+port,'-t',web],{stdio:'ignore'});
let passed=0;
try{
for(let i=0;i<50;i++){try{await fetch(config.siteUrl+'/api/anfrage.php');break;}catch{await new Promise(r=>setTimeout(r,100));}}
const send=async(overrides={},attachment=false)=>{const form=new FormData();const values={leistung:'Möbelmontage',plz:'10115',objektart:'Wohnung',etage:'1. OG',aufzug:'Nein',zeitraum:'Flexibel',name:'Synthetischer Test',telefon:'0301234567',kontaktart:'Telefon',datenschutz:'ja',gestartet:String(Date.now()-10000),...overrides};for(const[k,v]of Object.entries(values))form.set(k,v);if(attachment)form.set('fotos[]',new Blob(['not an image'],{type:'image/jpeg'}),'invalid.jpg');return fetch(config.siteUrl+'/api/anfrage.php',{method:'POST',body:form,redirect:'manual'});};
const records=()=>readdirSync(join(storage,'anfragen')).filter(x=>x.endsWith('.json')).map(x=>JSON.parse(readFileSync(join(storage,'anfragen',x),'utf8')));
let r=await send();assert.equal(r.status,303,'Response: '+await r.text());assert.match(r.headers.get('location'),/ref=SH-\d{6}-[A-F0-9]{5}$/);assert.equal(records()[0].mailVersand,'ok');assert.equal(mailCount,1);passed++;
r=await send({kontaktart:'E-Mail'});assert.match(r.headers.get('location'),/unvollstaendig.*mail/);assert.equal(mailCount,1);passed++;
r=await send({plz:'wrong'});assert.match(r.headers.get('location'),/unvollstaendig.*plz/);assert.equal(mailCount,1);passed++;
rejectMail=true;r=await send();assert.equal(r.status,303);assert.equal(records().length,2);assert.ok(records().some(x=>x.mailVersand!=='ok'));assert.equal(mailCount,1);passed++;
// Block only the request-record directory; upload/rate directories remain writable.
const blocked=join(dir,'blocked');mkdirSync(blocked);writeFileSync(join(blocked,'anfragen'),'blocked');config.storageDir=blocked;writeFileSync(join(web,'api/config.local.php'),'<?php return json_decode(base64_decode(\''+Buffer.from(JSON.stringify(config)).toString('base64')+'\'),true);');
r=await send();assert.match(r.headers.get('location'),/grund=speicher-nicht-verfuegbar/);assert.equal(mailCount,1);passed++;
config.storageDir=storage;writeFileSync(join(web,'api/config.local.php'),'<?php return json_decode(base64_decode(\''+Buffer.from(JSON.stringify(config)).toString('base64')+'\'),true);');
r=await send({},true);assert.equal(r.status,303);assert.match(r.headers.get('location'),/fotoHinweis=1/);assert.equal(records().length,3);assert.ok(records().some(x=>x.fotosAbgelehnt===1 && x.fotos.length===0));passed++;
delete config.recipient;delete config.from;rejectMail=false;writeFileSync(join(web,'api/config.local.php'),'<?php return json_decode(base64_decode(\''+Buffer.from(JSON.stringify(config)).toString('base64')+'\'),true);');
r=await send();assert.equal(r.status,303);assert.match(r.headers.get('location'),/versand=ok/);assert.equal(records().length,4);assert.equal(mailCount,2);passed++;
console.log(passed+' request integration cases passed; no external mail; synthetic files: '+dir);
}finally{const stopped=new Promise(r=>server.once('exit',r));server.kill();await stopped;await new Promise(r=>smtp.close(r));}
