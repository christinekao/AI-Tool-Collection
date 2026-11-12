#!/usr/bin/env node
/**
 * P0 read-only audit. Never writes, migrates, or deletes source records.
 * Run: node scripts/audit-p0.mjs
 * Gate for removal of legacy files: node scripts/audit-p0.mjs --strict-legacy
 */
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const types = {
  resources: 'resource', skills: 'skill', concepts: 'concept',
  prompts: 'prompt', combinations: 'combination', workflows: 'workflow'
};
const reverse = Object.fromEntries(Object.entries(types).map(([plural, one]) => [one, plural]));
const errors = [];
const warnings = [];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const optional = file => fs.existsSync(file) ? read(file) : null;
const normalized = value => String(value ?? '').trim().toLowerCase();
const normalizedUrl = value => normalized(value).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const slug = value => normalized(value).normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100) || 'item';
const list = value => Array.isArray(value) ? value : [];
const nonempty = value => value !== undefined && value !== null && value !== '';
const catalog = read('data/catalog-v2.json');
const manifest = read('data/manifest-v2.json');
const ids = {};
const inventory = {};

for (const [plural, singular] of Object.entries(types)) {
  const dir = path.join('data', plural);
  const files = fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort();
  const rows = list(catalog[plural]);
  const rowIds = rows.map(row => row.id);
  const fileIds = files.map(name => name.slice(0, -5));
  const indexIds = list(manifest.entities?.[plural]);
  ids[plural] = new Set(rowIds);
  inventory[plural] = { files: fileIds.length, catalog: rowIds.length, manifest: indexIds.length };

  if (new Set(rowIds).size !== rowIds.length) errors.push(plural + ': duplicate catalog IDs');
  if (!isDeepStrictEqual([...rowIds].sort(), fileIds)) errors.push(plural + ': catalog IDs do not match source files');
  if (!isDeepStrictEqual([...rowIds].sort(), [...indexIds].sort())) errors.push(plural + ': manifest IDs do not match catalog');

  for (const row of rows) {
    const filename = path.join(dir, row.id + '.json');
    if (!fs.existsSync(filename)) continue;
    const source = read(filename);
    if (row.entityType !== singular || row.schemaVersion !== 2 || source.id !== row.id) {
      errors.push(plural + '/' + row.id + ': type, schema or ID mismatch');
    }
    if (!isDeepStrictEqual(source, row)) errors.push(plural + '/' + row.id + ': source differs from generated catalog');
  }
}

let referenceCount = 0;
const edgeCounts = {};
function checkRefs(value, owner, location = '') {
  if (Array.isArray(value)) {
    value.forEach((item, i) => checkRefs(item, owner, location + '/' + i));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (value.type && value.id && reverse[value.type]) {
    referenceCount++;
    edgeCounts[owner] = (edgeCounts[owner] || 0) + 1;
    if (!ids[reverse[value.type]]?.has(value.id)) {
      errors.push(owner + location + ': dangling reference ' + value.type + '/' + value.id);
    }
    return;
  }
  for (const [key, item] of Object.entries(value)) checkRefs(item, owner, location + '/' + key);
}
for (const plural of Object.keys(types)) {
  for (const row of list(catalog[plural])) checkRefs(row, plural + '/' + row.id);
}

const legacyNames = [
  'resources.json', 'resources.updates.json', 'resources.intake.json',
  'concepts.json', 'concepts.intake.json', 'prompts.json',
  'combinations.json', 'social-post-intake.json'
];
const legacyPresent = legacyNames.filter(name => fs.existsSync(name));
const social = optional('social-post-intake.json');
const legacyResources = [
  ...list(optional('resources.json')), ...list(optional('resources.updates.json')),
  ...list(optional('resources.intake.json')), ...(social?.resource ? [social.resource] : [])
];
const legacyConcepts = [
  ...list(optional('concepts.json')), ...list(optional('concepts.intake.json')),
  ...(social?.concept ? [social.concept] : [])
];
const legacyPrompts = list(optional('prompts.json'));
const legacyCombinations = [
  ...list(optional('combinations.json')), ...(social?.combination ? [social.combination] : [])
];
const uniqueLegacyResources = new Map();
for (const row of legacyResources) {
  const key = normalized(row.repo || row.url || row.canonicalName || row.name);
  if (key) uniqueLegacyResources.set(key, row);
}
const byResource = new Map();
function indexResource(key, row) {
  if (!key) return;
  const k = normalized(key);
  const group = byResource.get(k) || new Set();
  group.add(row);
  byResource.set(k, group);
}
for (const row of list(catalog.resources)) {
  for (const key of [row.id, row.title, row.canonicalName, row.repo]) indexResource(key, row);
  if (row.url) indexResource(normalizedUrl(row.url), row);
}
function matchingResource(row) {
  const candidates = [
    row.url ? normalizedUrl(row.url) : '',
    row.repo, row.canonicalName, row.name, slug(row.canonicalName || row.name || row.repo)
  ];
  for (const key of candidates) {
    const matches = byResource.get(normalized(key));
    if (matches?.size === 1) return [...matches][0];
  }
  return null;
}
const missingLegacyResources = [];
const legacyMetadataGaps = {};
const missingContent = [];
for (const old of uniqueLegacyResources.values()) {
  const current = matchingResource(old);
  if (!current) {
    missingLegacyResources.push(old.name || old.canonicalName || old.repo || old.url);
    continue;
  }
  // These historical metadata fields were not mapped by migrate-v2.mjs.
  for (const key of ['displayStatus', 'researchStatus', 'conceptReviewedAt', 'researchInterest', 'installed']) {
    if (nonempty(old[key]) && !nonempty(current[key])) {
      legacyMetadataGaps[key] = (legacyMetadataGaps[key] || 0) + 1;
    }
  }
  for (const key of ['purpose', 'recommendation', 'url', 'notes']) {
    if (nonempty(old[key]) && !nonempty(current[key])) missingContent.push(current.id + ': ' + key);
  }
  for (const key of ['tags', 'concepts']) {
    const actual = key === 'concepts'
      ? list(current.conceptRefs).map(ref => ref.id) : list(current.tags);
    for (const item of list(old[key])) {
      if (!actual.includes(item)) missingContent.push(current.id + ': ' + key + '/' + item);
    }
  }
}
const conceptIds = new Set(list(catalog.concepts).map(row => row.id));
const promptIds = new Set(list(catalog.prompts).map(row => row.id));
const missingLegacyConcepts = legacyConcepts.filter(row => row.id && !conceptIds.has(row.id)).map(row => row.id);
const missingLegacyPrompts = legacyPrompts.filter(row => !promptIds.has(row.id)).map(row => row.id);
const missingLegacyCombinations = legacyCombinations.filter(old =>
  !list(catalog.combinations).some(row => row.title === (old.name || old.title) || row.goal === old.goal)
).map(row => row.name || row.title);
const conceptAppendGaps = [];
for (const patch of list(optional('concepts.intake.json'))) {
  const current = list(catalog.concepts).find(row => row.id === patch.id);
  if (!current) continue;
  for (const [key, values] of Object.entries(patch)) {
    if (!key.endsWith('Append')) continue;
    const target = list(current[key.slice(0, -6)]);
    for (const item of list(values)) {
      if (!target.includes(item)) conceptAppendGaps.push(patch.id + '/' + key);
    }
  }
}

if (missingLegacyResources.length) warnings.push('Unmatched legacy Resource records: ' + missingLegacyResources.length);
if (missingLegacyConcepts.length) warnings.push('Unmatched legacy Concept records: ' + missingLegacyConcepts.length);
if (missingLegacyPrompts.length) warnings.push('Unmatched legacy Prompt records: ' + missingLegacyPrompts.length);
if (missingLegacyCombinations.length) warnings.push('Unmatched legacy Combination records: ' + missingLegacyCombinations.length);
if (conceptAppendGaps.length) warnings.push('Legacy concept append values not found: ' + conceptAppendGaps.length);
if (missingContent.length) warnings.push('Legacy content values missing: ' + missingContent.length);
if (Object.keys(legacyMetadataGaps).length) warnings.push('Historical metadata is not fully preserved in V2');

const result = {
  checkedAt: new Date().toISOString(),
  mode: process.argv.includes('--strict-legacy') ? 'strict-legacy' : 'audit',
  v2: { inventory, total: Object.values(inventory).reduce((n, x) => n + x.files, 0), referenceCount, brokenReferences: errors.filter(e => e.includes('dangling reference')).length },
  legacy: {
    filesPresent: legacyPresent,
    resourceInputs: legacyResources.length,
    uniqueResourceIdentities: uniqueLegacyResources.size,
    unmatched: {
      resources: missingLegacyResources,
      concepts: missingLegacyConcepts,
      prompts: missingLegacyPrompts,
      combinations: missingLegacyCombinations
    },
    missingContent: missingContent.slice(0, 30),
    missingContentCount: missingContent.length,
    missingConceptAppendCount: conceptAppendGaps.length,
    metadataGaps: legacyMetadataGaps
  },
  errors, warnings,
  eligibleToDeleteLegacy: legacyPresent.length > 0 && warnings.length === 0 && errors.length === 0
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
else if (result.mode === 'strict-legacy' && warnings.length) process.exitCode = 2;
