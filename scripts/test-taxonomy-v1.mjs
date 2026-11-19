#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DOMAIN_DEFS,classifyRecord} from './domain-classifier-v1.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const t=read('data/taxonomy-v1.json'),dirs={resources:'resource',skills:'skill',concepts:'concept',prompts:'prompt',combinations:'combination',workflows:'workflow'};
const ids=k=>new Set(t[k].map(o=>o.id));
const domains=ids('domains'),facets=ids('purposeFacets'),formats=ids('contentFormats'),caps=ids('capabilities'),states=ids('capabilityEvidenceStatuses');
const uniq=a=>new Set(a).size===a.length;
const prop=(x,p)=>p.split('.').reduce((a,k)=>a?.[k],x);
test('Vocabulary and classifier share 10 domains',()=>{
 assert.equal(domains.size,10);assert.deepEqual(DOMAIN_DEFS,t.domains);
 for(const name of ['domains','purposeFacets','contentFormats','capabilities'])assert.ok(uniq(t[name].map(x=>x.id)),name);
 assert.ok([...facets].every(x=>!domains.has(x)));
 for(const target of Object.values(t.domainAliases))assert.ok(domains.has(target));
});
test('All canonical records preserve domains and validate optional formats/capabilities',()=>{
 let count=0,formatsSeen=0,capsSeen=0;
 for(const [dir,singular] of Object.entries(dirs))for(const filename of fs.readdirSync(path.join(root,'data',dir)).filter(p=>p.endsWith('.json'))){
  const x=read('data/'+dir+'/'+filename),where=dir+'/'+filename,c=x.classification;count++;
  assert.equal(x.entityType,singular,where);assert.equal(x.id,filename.slice(0,-5),where);
  assert.ok(domains.has(c.primaryDomain),where+' primary');
  assert.ok(Array.isArray(c.secondaryDomains)&&c.secondaryDomains.length<=2&&uniq(c.secondaryDomains),where+' secondaries');
  assert.ok(c.secondaryDomains.every(v=>domains.has(v)&&v!==c.primaryDomain),where+' secondary domain');
  assert.ok(c.purposeFacets.every(v=>facets.has(v)),where+' purpose');
  assert.ok(t.reviewStatuses.includes(c.reviewStatus),where+' reviewStatus');
  if(c.contentFormat!==undefined){
   formatsSeen++;assert.ok(formats.has(c.contentFormat),where);
   assert.ok(c.formatEvidenceFields?.length,where+' missing format evidence');
   for(const f of c.formatEvidenceFields)assert.ok(prop(x,f)!=null&&prop(x,f)!=='',where+' format field '+f);
  }
  if(c.capabilities!==undefined){
   assert.ok(uniq(c.capabilities.map(v=>v.id)),where+' duplicate cap');
   for(const a of c.capabilities){
    capsSeen++;assert.ok(caps.has(a.id),where+' cap id '+a.id);
    assert.ok(states.has(a.status),where+' evidence status');
    if(a.status==='source-reviewed')assert.ok(a.verificationEvidence?.sourceUrl&&a.verificationEvidence?.reviewedAt,where+' source review needs URL/date');
    if(a.status==='runtime-tested')assert.ok(a.verificationEvidence?.testRun?.executedAt&&a.verificationEvidence?.testRun?.scenario&&a.verificationEvidence?.testRun?.result,where+' runtime proof required');
    assert.ok(a.evidenceFields?.length,where+' cap fields');
    for(const f of a.evidenceFields)assert.ok(prop(x,f)!=null&&prop(x,f)!=='',where+' cap field '+f);
   }
  }
 }
 const manifest=read('data/manifest-v2.json');
 assert.equal(count,Object.values(manifest.entities).reduce((n,ids)=>n+ids.length,0));
 assert.ok(formatsSeen>=10,'pilot formats must remain represented');
 assert.ok(capsSeen>=13,'pilot capabilities must remain represented');
});
test('Samples have independent Entity Type, Domain, Format and Capability',()=>{
 const r=read('data/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide.json');
 assert.equal(r.classification.contentFormat,'learning-guide');assert.ok(r.classification.purposeFacets.includes('learning'));
 assert.deepEqual(r.classification.capabilities,[]);
 const skill=read('data/skills/alexyc9381-hiring-panel.json');
 assert.equal(skill.classification.primaryDomain,'career');assert.ok(!skill.classification.contentFormat);
 assert.deepEqual(skill.classification.capabilities.map(x=>x.id),['resume-review','resume-rewriting']);
 const prompt=read('data/prompts/star-resume-experience-three-rewrites.json');
 assert.ok(prompt.classification.capabilities.some(x=>x.id==='resume-rewriting'));
 const hermes=read('data/resources/hermes-backsearch.json');
 assert.equal(classifyRecord(hermes).primaryDomain,'data');
 assert.equal(hermes.classification.capabilities[0].status,'canonical-described');
});
test('Catalog UI loads domain vocabulary rather than embedding a duplicate',()=>{
 const js=fs.readFileSync(path.join(root,'catalog-app.js'),'utf8');
 assert.match(js,/fetch\('data\/taxonomy-v1\.json'/);assert.doesNotMatch(js,/const TOPICS=\[/);
});

test('A clarification interview is not automatically a recruiting or career interview',()=>{
 const x=read('data/skills/mattpocock-grill-me.json');
 assert.equal(x.classification.primaryDomain,'ai-agent');
 assert.ok(!x.classification.secondaryDomains.includes('career'));
 assert.equal(classifyRecord(x).primaryDomain,'ai-agent');
 const other=read('data/skills/alexyc9381-hiring-panel.json');
 assert.equal(other.classification.primaryDomain,'career');
 assert.equal(classifyRecord(other).primaryDomain,'career');
 const fresh={...x,classification:undefined,title:'Clarification interview',id:'hypothetical-clarification',purpose:'Interview a user to clarify product requirements before deciding a solution',problem:'Ambiguous requirements'};
 assert.notEqual(classifyRecord(fresh).primaryDomain,'career','interview alone must not be a career indicator');
 const hiring={...fresh,id:'mock-job-interview',title:'Mock job interview preparation',purpose:'Prepare for a job interview using a resume and job description'};
 assert.equal(classifyRecord(hiring).primaryDomain,'career','hiring context must still be recognized');
});
