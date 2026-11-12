import test from 'node:test';
import assert from 'node:assert/strict';
import {buildKnowledgeGraph} from './knowledge-graph-core.mjs';

const empty=()=>({schemaVersion:2,resources:[],skills:[],concepts:[],prompts:[],combinations:[],workflows:[]});
const concept={schemaVersion:2,id:'visual-flow',entityType:'concept',title:'Visual Flow',coreProblem:'Disjointed editing stages'};
const resource={schemaVersion:2,id:'video-tool',entityType:'resource',title:'Video Tool',purpose:'Edits video clips',conceptRefs:[{type:'concept',id:'visual-flow'}]};
const problem=()=>({schemaVersion:1,id:'make-video',title:'Create a video',question:'How?',description:'Video editing journey',outcome:'First demo video',tags:['video'],links:[{type:'concept',id:'visual-flow',relation:'explained_by',why:'Explains a durable concept',evidenceField:'coreProblem'},{type:'resource',id:'video-tool',relation:'supported_by',why:'Provides editing capability',evidenceField:'purpose'}],relatedProblems:[]});

test('builds deterministic graph with explicit reverse-traversable references',()=>{
 const c=empty();c.resources=[resource];c.concepts=[concept];
 const a=buildKnowledgeGraph(c,[problem()]),b=buildKnowledgeGraph(c,[problem()]);
 assert.deepEqual(a,b);
 assert.equal(a.counts.nodes,3);
 assert.equal(a.counts.canonicalEdges,1);
 assert.equal(a.counts.curatedEdges,2);
 assert.ok(a.edges.some(e=>e.from==='resource:video-tool'&&e.to==='concept:visual-flow'&&e.kind==='canonical'));
 assert.ok(a.edges.some(e=>e.from==='problem:make-video'&&e.to==='resource:video-tool'&&e.kind==='curated'));
});
test('refuses orphan canonical refs',()=>{
 const c=empty();c.resources=[resource];
 assert.throws(()=>buildKnowledgeGraph(c,[]),/Dangling graph edge/);
});
test('refuses unsupported semantic relation',()=>{
 const c=empty();c.resources=[resource];c.concepts=[concept];
 const p=problem();p.links[0].relation='alternative_to';
 assert.throws(()=>buildKnowledgeGraph(c,[p]),/Invalid curated link/);
});
test('refuses Problem link without source-backed evidence field',()=>{
 const c=empty();c.resources=[resource];c.concepts=[concept];
 const p=problem();p.links[0].evidenceField='doesNotExist';
 assert.throws(()=>buildKnowledgeGraph(c,[p]),/Missing cited record field/);
});
test('refuses unresolved subproblem',()=>{
 const c=empty();c.resources=[resource];c.concepts=[concept];
 const p=problem();p.relatedProblems=[{id:'not-added',why:'Subtopic'}];
 assert.throws(()=>buildKnowledgeGraph(c,[p]),/Dangling graph edge/);
});
