#!/usr/bin/env node
/**
 * Wait for the deployed Pages catalog to match this checkout's canonical data.
 * The historical Playground asset check alone cannot prove a new data release.
 * This is HTTP publication evidence; deployed Chromium follows independently.
 */
import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';

const base=(process.env.LIVE_SITE_BASE||'https://christinekao.github.io/AI-Tool-Collection').replace(/\/$/,'');
const signature='playground-app.js?v=20261124-audit08';
const types=['resources','skills','concepts','prompts','combinations','workflows'];
const expected={schemaVersion:2};
for(const type of types){
 const dir=path.join('data',type);
 expected[type]=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort().map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')));
}
const attempts=45,delayMs=3000;
let status='not-requested';
for(let i=0;i<attempts;i++){
 try{
  const suffix='?release-gate='+Date.now()+'-'+i;
  const opts={headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20_000)};
  const page=await fetch(base+'/playground.html'+suffix,opts);
  const html=await page.text();
  if(page.ok&&html.includes(signature)){
   const response=await fetch(base+'/data/catalog-v2.json'+suffix,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20_000)});
   if(response.ok){
    const actual=await response.json();
    const match=isDeepStrictEqual(actual,expected);
    status='HTTP '+response.status+'; exact canonical catalog='+match;
    if(match){
     console.log('PASS: deployed catalog matches all six canonical collections '+JSON.stringify(Object.fromEntries(types.map(t=>[t,expected[t].length])))+' (attempt '+(i+1)+')');
     process.exit(0);
    }
   }else status='catalog HTTP '+response.status;
  }else status='Playground HTTP '+page.status+'; historical asset='+html.includes(signature);
 }catch(error){status=String(error.message).slice(0,200);}
 if(i<attempts-1)await new Promise(resolve=>setTimeout(resolve,delayMs));
}
console.error('FAIL: deployed release did not match this checkout: '+status);
process.exit(1);
