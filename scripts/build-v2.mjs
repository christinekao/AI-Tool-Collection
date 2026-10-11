import fs from 'node:fs';
import path from 'node:path';

const types = {resources:'resource',skills:'skill',concepts:'concept',prompts:'prompt',combinations:'combination',workflows:'workflow'};
const records = {}, errors = [];
for (const [plural, singular] of Object.entries(types)) {
  const dir = path.join('data', plural);
  const files = fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort();
  records[plural] = files.map(file => {
    const record = JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
    for (const key of ['schemaVersion','id','entityType','title','status','addedAt','updatedAt','tags']) if (record[key] === undefined || record[key] === null) errors.push(`${dir}/${file}: missing ${key}`);
    if (record.schemaVersion !== 2 || record.entityType !== singular || record.id !== file.slice(0,-5)) errors.push(`${dir}/${file}: schema/type/filename mismatch`);
    if (!Array.isArray(record.tags)) errors.push(`${dir}/${file}: tags must be an array`);
    return record;
  });
  if (new Set(records[plural].map(x=>x.id)).size !== files.length) errors.push(`${dir}: duplicate id`);
}
const singularToPlural = Object.fromEntries(Object.entries(types).map(([plural,singular])=>[singular,plural]));
const ids = Object.fromEntries(Object.keys(types).map(plural=>[plural,new Set(records[plural].map(x=>x.id))]));
function walk(value, location) {
  if (Array.isArray(value)) return value.forEach((item,i)=>walk(item,`${location}[${i}]`));
  if (!value || typeof value !== 'object') return;
  if (typeof value.type === 'string' && typeof value.id === 'string' && singularToPlural[value.type]) {
    if (!ids[singularToPlural[value.type]].has(value.id)) errors.push(`${location}: dangling ${value.type}/${value.id}`);
  }
  for (const [key,item] of Object.entries(value)) walk(item,`${location}.${key}`);
}
for (const [plural,items] of Object.entries(records)) items.forEach(x=>walk(x,`${plural}/${x.id}`));
if (errors.length) { console.error(JSON.stringify({ok:false,errors},null,2)); process.exit(1); }
const catalog = {schemaVersion:2,...records};
const manifest = {schemaVersion:2,generatedAt:new Date().toISOString(),entities:Object.fromEntries(Object.entries(records).map(([plural,items])=>[plural,items.map(x=>x.id)]))};
function writeIfChanged(file, content) {
  if (!fs.existsSync(file) || fs.readFileSync(file,'utf8') !== content) fs.writeFileSync(file,content);
}
const catalogText = JSON.stringify(catalog,null,2)+'\n';
writeIfChanged('data/catalog-v2.json',catalogText);
const oldManifest = fs.existsSync('data/manifest-v2.json') ? JSON.parse(fs.readFileSync('data/manifest-v2.json','utf8')) : null;
if (oldManifest && JSON.stringify(oldManifest.entities) === JSON.stringify(manifest.entities)) manifest.generatedAt=oldManifest.generatedAt;
writeIfChanged('data/manifest-v2.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({ok:true,counts:Object.fromEntries(Object.entries(records).map(([k,v])=>[k,v.length]))},null,2));
