#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildTagIndex,normalizeTagKey,normalizeTags,vocabularyIndex} from './tag-taxonomy-core.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),t=read('data/taxonomy-v1.json');
test('Tag vocabulary IDs, dimensions and aliases are unique and valid',()=>{
 const lookup=vocabularyIndex(t);
 assert.ok(lookup.size>=t.tagVocabulary.length);
 assert.ok(t.tagDimensions.length>=8);
 assert.equal(normalizeTagKey('CLI'),'cli');
 assert.equal(normalizeTagKey('MIT License'),'mit-license');
});
test('Acronyms, aliases and duplicate mentions map without semantic overreach',()=>{
 const x=normalizeTags(['MIT','mit-license','agent-skill','agent-skills','CLI','cli','source-verified','Unknown Project ID'],t);
 assert.deepEqual(x.normalized.filter(v=>v.id==='mit')[0],{id:'mit',dimension:'license-mention',sourceTags:['MIT','mit-license']});
 assert.equal(x.normalized.filter(v=>v.id==='agent-skill')[0].sourceTags.length,2);
 assert.equal(x.normalized.filter(v=>v.id==='cli').length,1);
 assert.ok(x.normalized.some(v=>v.id==='source-verified'&&v.dimension==='legacy-status'));
 assert.deepEqual(x.unmapped,['Unknown Project ID']);
});
test('All Canonical tags are preserved, deterministic and traceable in derived index',()=>{
 const catalog=read('data/catalog-v2.json'),generated=read('data/tag-index-v1.json'),expected=buildTagIndex(catalog,t);
 assert.deepEqual(generated,expected);
 assert.equal(generated.summary.records,Object.values(catalog).filter(Array.isArray).reduce((s,x)=>s+x.length,0));
 assert.ok(generated.summary.mappedTagInstances>0);
 assert.ok(generated.summary.unmappedTagInstances>0);
 const example=generated.records['resource/agentic-system-lab-harness-relay'];
 assert.ok(example.normalized.some(v=>v.id==='claude-code'));
 assert.ok(example.normalized.some(v=>v.id==='apache-2.0'));
 assert.ok(!example.normalized.some(v=>v.id==='source-reviewed'));
});
test('Unknown labels are preserved rather than auto-invented as Capabilities',()=>{
 const value=normalizeTags(['career','security','unicorn-proprietary-licence'],t);
 assert.deepEqual(value.unmapped,['career','security','unicorn-proprietary-licence']);
});

test('High-confidence recurring Tags are mapped without promoting broad topic words',()=>{
 const x=normalizeTags(['worktree','human-approval','design-to-code','reverse-engineering','handoff','deduplication','github','security','frontend','privacy','evidence'],t);
 for(const id of ['worktree','human-approval','design-to-code','reverse-engineering','handoff','deduplication','github'])assert.ok(x.normalized.some(row=>row.id===id));
 assert.deepEqual(x.unmapped,['security','frontend','privacy','evidence']);
});

test('Only a compact cross-domain tag set is featured, while all original Tags stay searchable',()=>{
 const featured=t.tagPresentation.featured, ids=new Set(t.tagVocabulary.map(x=>x.id));
 assert.ok(featured.length<=15,'do not recreate full vocabulary as visible chips');
 assert.ok(new Set(featured).size===featured.length,'no duplicate visible chips');
 assert.ok(featured.every(id=>ids.has(id)),'featured IDs must exist in controlled vocabulary');
 const blocked=new Set(['agent-skill','skill-mention','workflow','combination','claude-code','codex','github','python','api','mcp','mit','apache-2.0','security-review','privacy-review','uninstalled','source-verified','learning','reference']);
 assert.ok(featured.every(x=>!blocked.has(x)),'entity types, vendors, technologies, metadata and state are not visible tags');
 assert.ok(t.tagPresentation.maxCard<=2&&t.tagPresentation.maxDetail<=4);
 assert.equal(t.tagPresentation.allowNoTags,true);
 assert.equal(t.tagPresentation.rawTagsSearchable,true);
 const ui=fs.readFileSync('catalog-app.js','utf8');
 assert.match(ui,/FEATURED_TAGS/);
 assert.match(ui,/list\(x\.tags\)\.join/,'raw tag search must remain');
 assert.ok(!ui.includes('tags(x.tags,12)'),'details must not flood the page');
});
