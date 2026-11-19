#!/usr/bin/env node
/** Advisory semantic classification audit; never calls a model or infers authoritative labels. */
import fs from 'node:fs';
import path from 'node:path';
const dirs=['resources','skills','concepts','prompts','combinations','workflows'];
const rows=[];
for(const folder of dirs){
 for(const file of fs.readdirSync(path.join('data',folder)).filter(name=>name.endsWith('.json'))){
  const p='data/'+folder+'/'+file;
  const x=JSON.parse(fs.readFileSync(p,'utf8'));
  rows.push({path:p,id:x.id,title:x.title,domain:x.classification?.primaryDomain,review:x.classification?.reviewStatus,
   purpose:String(x.purpose||x.goal||x.coreProblem||x.problem||'').slice(0,180),
   problem:String(x.problem||x.coreProblem||'').slice(0,100),
   tags:x.tags||[]});
 }
}
const domainCounts={};for(const row of rows)domainCounts[row.domain]=(domainCounts[row.domain]||0)+1;
const career=rows.filter(row=>row.domain==='career');
const strongCareer=/(?:\bresume\b|\brecruit(?:er|ment|ing)?\b|\bhiring\b|\bjob[ -]?(?:search|application|posting|interview)\b|\bcareer\b|\bats\b|\bheadhunt|\bcandidate\b|\bcover[ -]?letter\b|履歷|求職|職涯|招募|招聘|職缺|獵頭|求才|面試準備)/i;
const suspicious=career.filter(row=>!strongCareer.test([row.title,row.purpose,row.problem].join(' ')));
console.log(JSON.stringify({kind:'CLASSIFICATION_SEMANTIC_AUDIT',checked:rows.length,domainCounts,careerCount:career.length,
 careerRecords:career.map(({path,title,purpose,review})=>({path,title,purpose,review})),
 careerNeedsHumanReview:suspicious.map(({path,title,purpose,review})=>({path,title,purpose,review})),
 note:'Potential issues only. A keyword heuristic cannot replace intent and source review; career indicators must describe the actual goal.'},null,2));
if(rows.length!==548||rows.some(x=>!x.domain))process.exitCode=1;
const grill=rows.find(x=>x.path==='data/skills/mattpocock-grill-me.json');
if(grill?.domain!=='ai-agent')process.exitCode=1;
