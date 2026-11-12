#!/usr/bin/env node
/**
 * Canonical V2 read-only validation; no historical V1 file dependencies.
 * Run: node scripts/validate-v2.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const kinds = {
  resources: 'resource', skills: 'skill', concepts: 'concept',
  prompts: 'prompt', combinations: 'combination', workflows: 'workflow'
};
const typeToPlural = Object.fromEntries(Object.entries(kinds).map(([a, b]) => [b, a]));
const required = ['schemaVersion', 'id', 'entityType', 'title', 'status', 'addedAt', 'updatedAt', 'tags'];
const errors = [];
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const catalog = read('data/catalog-v2.json');
const manifest = read('data/manifest-v2.json');
const ids = {};
const counts = {};

if (catalog.schemaVersion !== 2 || manifest.schemaVersion !== 2) {
  errors.push('Catalog / Manifest: schemaVersion is not 2');
}
for (const [plural, singular] of Object.entries(kinds)) {
  const folder = path.join('data', plural);
  const filenames = fs.readdirSync(folder).filter(name => name.endsWith('.json')).sort();
  const files = filenames.map(name => ({ name, record: read(path.join(folder, name)) }));
  const rows = Array.isArray(catalog[plural]) ? catalog[plural] : [];
  ids[plural] = new Set(rows.map(row => row.id));
  counts[plural] = { source: files.length, catalog: rows.length, manifest: (manifest.entities?.[plural] ?? []).length };

  if (ids[plural].size !== rows.length) errors.push(plural + ': duplicate catalog IDs');
  if (!isDeepStrictEqual(filenames.map(name => name.slice(0, -5)).sort(), [...ids[plural]].sort())) {
    errors.push(plural + ': source filenames and catalog IDs differ');
  }
  if (!isDeepStrictEqual([...ids[plural]].sort(), [...(manifest.entities?.[plural] ?? [])].sort())) {
    errors.push(plural + ': manifest and catalog IDs differ');
  }
  const catalogById = new Map(rows.map(row => [row.id, row]));
  for (const { name, record } of files) {
    const where = folder + '/' + name;
    for (const key of required) {
      if (record[key] === null || record[key] === undefined) errors.push(where + ': missing ' + key);
    }
    if (record.schemaVersion !== 2 || record.entityType !== singular || record.id !== name.slice(0, -5)) {
      errors.push(where + ': ID, file name, type or schema mismatch');
    }
    if (!Array.isArray(record.tags)) errors.push(where + ': tags must be array');
    if (!isDeepStrictEqual(record, catalogById.get(record.id))) errors.push(where + ': catalog copy differs from canonical source');
  }
}

let refs = 0;
function inspect(value, location) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspect(item, location + '/' + index));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.type === 'string' && typeof value.id === 'string' && typeToPlural[value.type]) {
    refs++;
    if (!ids[typeToPlural[value.type]].has(value.id)) {
      errors.push(location + ': missing ' + value.type + '/' + value.id);
    }
    return;
  }
  for (const [key, item] of Object.entries(value)) inspect(item, location + '/' + key);
}
for (const plural of Object.keys(kinds)) {
  for (const record of catalog[plural] ?? []) inspect(record, plural + '/' + record.id);
}

const result = {
  ok: errors.length === 0,
  counts,
  totalNodes: Object.values(counts).reduce((sum, item) => sum + item.source, 0),
  checkedTypedReferences: refs,
  errors
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
