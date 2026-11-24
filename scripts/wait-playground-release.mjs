#!/usr/bin/env node
/**
 * Wait for the EXACT GitHub Pages release asset before deployed Chromium.
 * Avoid testing a previous release while Pages deploy is still in progress.
 * This is HTTP publication evidence only; browser QA follows separately.
 */
const base=process.env.LIVE_SITE_BASE||'https://christinekao.github.io/AI-Tool-Collection';
const path='playground.html';
const signature='playground-app.js?v=20261124-audit08';
const attempts=90,delayMs=1500;
let status='not-requested';
for(let i=0;i<attempts;i++){
 try{
  const url=base.replace(/\/$/,'')+'/'+path+'?release-gate='+Date.now()+'-'+i;
  const response=await fetch(url,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(10_000)});
  const html=await response.text();
  status='HTTP '+response.status+'; audit08 asset='+html.includes(signature);
  if(response.ok&&html.includes(signature)){
   console.log('PASS: deployed release contains '+signature+' (attempt '+(i+1)+')');
   process.exit(0);
  }
 }catch(error){status=String(error.message).slice(0,160)}
 if(i<attempts-1)await new Promise(resolve=>setTimeout(resolve,delayMs));
}
console.error('FAIL: deployed release did not reach required asset version: '+status);
process.exit(1);
