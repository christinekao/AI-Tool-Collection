#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const catalog=read('data/catalog-v2.json'),graph=read('data/knowledge-graph-v1.json'),index=read('data/tag-index-v1.json');
const expected={"claude-mem":{"before":31,"after":5},"microsoft-tokeneconomizer":{"before":27,"after":5},"aws-samples-sample-agent-cost-bench":{"before":19,"after":5},"graphify-labs-graphify":{"before":23,"after":5},"oh-my-mermaid":{"before":25,"after":5},"humanlayer":{"before":25,"after":5},"strelov1-freehire":{"before":27,"after":5},"pingdotgg-t3code":{"before":28,"after":5},"block-buzz":{"before":28,"after":5},"cyyeh-agent-loop-visualizer":{"before":29,"after":5},"anthropics-financial-services":{"before":28,"after":5},"kieiken-project-hub":{"before":28,"after":5}};
test('first 12 Resources are truly trimmed in Canonical data and source preserved',()=>{
 assert.equal(catalog.resources.length,270);
 assert.equal(Object.keys(expected).length,12);
 for(const [id,v] of Object.entries(expected)){
  const rec=read('data/resources/'+id+'.json');
  assert.deepEqual(catalog.resources.find(x=>x.id===id),rec,'stale Catalog '+id);
  assert.equal(rec.tags.length,v.after,id+' count');
  assert.ok(v.before>v.after,'no removal '+id);
  assert.ok(rec.url||rec.repo,'source lost '+id);
  assert.ok(rec.purpose?.length>50,'purpose lost '+id);
  assert.equal(rec.updatedAt,'2026-11-19',id);
  assert.deepEqual(graph.nodes.find(x=>x.key==='resource:'+id)?.tags,rec.tags,'stale Graph '+id);
  const row=index.records['resource/'+id];
  assert.equal(row.normalized.flatMap(x=>x.sourceTags).length+row.unmapped.length,rec.tags.length,'stale Tag Index '+id);
 }
});
test('all 548 canonical entity records remain and no duplicate Tag source file',()=>{
 for(const [key,count] of Object.entries({resources:270,skills:123,concepts:68,prompts:34,combinations:17,workflows:36}))assert.equal(catalog[key].length,count,key);
 assert.equal(index.summary.records,548);
 assert.equal(index.summary.tagInstances,5149);
 assert.ok(!fs.existsSync('data/featured-tags-v1.json'));
});
