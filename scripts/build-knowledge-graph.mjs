#!/usr/bin/env node
import fs from 'node:fs';
import {readProblems,buildKnowledgeGraph} from './knowledge-graph-core.mjs';
const catalog=JSON.parse(fs.readFileSync('data/catalog-v2.json','utf8'));
const graph=buildKnowledgeGraph(catalog,readProblems());
const dest='data/knowledge-graph-v1.json',content=JSON.stringify(graph,null,2)+'\n';
if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8')!==content)fs.writeFileSync(dest,content);
console.log(JSON.stringify({ok:true,counts:graph.counts},null,2));
