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

test('search index covers all V2 entities without manufacturing semantic links',()=>{
 const c=empty();c.resources=[{...resource,category:'Automation',tags:['reusable-agent'],useCases:['build a web assistant']}];c.concepts=[concept];
 const graph=buildKnowledgeGraph(c,[]);
 const item=graph.nodes.find(n=>n.key==='resource:video-tool');
 assert.match(item.searchText,/build a web assistant/);
 assert.ok(item.tags.includes('reusable-agent'));
 assert.equal(graph.counts.curatedEdges,0);
});


// Relationship census uses the same explicit reference traversal as the graph.
// These tests measure structural coverage, not semantic evidence or runtime success.
import {auditConceptRelations,loadConceptCensusCatalog} from './audit-concept-relations.mjs';
test('Concept census separates repeated paths, distinct directed pairs and reciprocal pairs',()=>{
 const c=empty();
 c.resources=[{...resource,extra:{type:'concept',id:'visual-flow'},intakeReview:{layerReview:{status:'mapped'}}},{...resource,id:'only-cited',conceptRefs:[],tags:['visual-flow']},{...resource,id:'unlinked',conceptRefs:[],intakeReview:{sourceStatus:'partial'}}];
 c.concepts=[{...concept,exampleRefs:[{type:'resource',id:'video-tool'},{type:'resource',id:'only-cited'}]},{...concept,id:'no-links'}];
 c.skills=[{id:'s',entityType:'skill',schemaVersion:2,title:'Skill',conceptRefs:[{type:'concept',id:'visual-flow'}]}];
 const before=JSON.stringify(c),a=auditConceptRelations(c);
 assert.equal(JSON.stringify(c),before);
 assert.equal(a.summary.conceptRelatedReferenceOccurrences,5);
 assert.equal(a.summary.distinctDirectedConceptPairs,4);
 assert.equal(a.summary.resourceConceptDirectedPairs,3);
 assert.equal(a.summary.uniqueResourceConceptPairs,2);
 assert.equal(a.summary.reciprocalResourceConceptPairs,1);
 assert.equal(a.summary.resourcesWithOutgoingConceptRefs,1);
 assert.equal(a.summary.resourcesWithAnyDirectConceptLink,2);
 assert.equal(a.summary.resourcesCitedOnlyByConcept,1);
 assert.deepEqual(a.queues.resourcesWithoutDirectConceptLink,['unlinked']);
 assert.deepEqual(a.queues.conceptsWithoutResourceLink,['no-links']);
 assert.equal(a.summary.conceptsWithoutAnyCanonicalRelation,1);
 assert.equal(a.summary.matrix.skill.toConcept,1);
 assert.equal(a.summary.resourceLayerStatusCounts['source-blocked'].withoutDirectLink,1);
 assert.equal(a.semanticVerification,'NOT_ASSESSED');
 assert.ok(a.resourceRows.every(r=>r.semanticStatus==='not-assessed-by-census'));
});
test('Concept census refuses dangling references, and ignores tags and local evidence IDs',()=>{
 const c=empty();
 c.resources=[{...resource,conceptRefs:[],tags:['visual-flow'],readerGuide:{useCases:[{evidenceRefs:['visual-flow']} ]}}];
 c.concepts=[concept];
 assert.equal(auditConceptRelations(c).summary.uniqueResourceConceptPairs,0);
 c.resources[0].conceptRefs=[{type:'concept',id:'not-found'}];
 assert.throws(()=>auditConceptRelations(c),/Dangling graph edge/);
});
test('Full Canonical Concept census: reproducible queues and coverage (not a semantic audit)',()=>{
 const c=loadConceptCensusCatalog();
 const a=auditConceptRelations(c),b=auditConceptRelations(c);
 assert.deepEqual(a,b);
 assert.equal(a.resourceRows.length,c.resources.length);
 assert.equal(a.conceptRows.length,c.concepts.length);
 assert.equal(a.summary.resourcesWithAnyDirectConceptLink+a.summary.resourcesWithoutDirectConceptLink,c.resources.length);
 assert.equal(a.summary.resourceConceptDirectedPairs,a.summary.uniqueResourceConceptPairs+a.summary.reciprocalResourceConceptPairs);
 assert.equal(Object.values(a.summary.resourceLayerStatusCounts).reduce((n,x)=>n+x.total,0),c.resources.length);
 for(const r of a.resourceRows)for(const id of r.distinctConcepts)assert.ok(a.conceptRows.find(x=>x.id===id).resourceIds.includes(r.id));
 console.log('CONCEPT_RELATION_CENSUS '+JSON.stringify({scope:a.scope,summary:a.summary,queues:a.queues}));
});
