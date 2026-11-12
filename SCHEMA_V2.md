# AI Tool Collection — Schema V2

## Goal

Turn the collection from a growing list of links into an extensible knowledge system. Tool churn must not destroy durable knowledge about problems, concepts, workflows, prompts, or combinations.

## Canonical entities

Each canonical record is stored as one UTF-8 JSON file under `data/<entity-type>/<id>.json`.

- `resources/` — external tools, repositories, products, runtimes, libraries and services.
- `skills/` — reusable executable agent skills/protocols. A skill may reference one or more resources but is independently discoverable.
- `concepts/` — durable problem/solution ideas that should survive individual tool churn.
- `prompts/` — reusable instructions/templates with a defined problem, inputs and intended outcome.
- `combinations/` — compatible capability bundles: what works together and why. They do not own execution order.
- `workflows/` — problem-solving processes: how work gets done. Workflows contain ordered stages and may reference resources, skills, prompts, combinations and concepts.

## Problem Layer and derived Graph (P1)

Goal-oriented discovery is modeled as small curated files under `data/problems/<id>.json`. Problems are **not** a seventh V2 entity: the six V2 canonical types and existing stable IDs stay intact.

A Problem record describes a specific user need and has `links` to existing entities, each with:

- `type` + `id`: the exact existing V2 target
- `relation`: `explained_by` (Concept), `supported_by` (Resource/Skill), `guided_by` (Workflow/Prompt), `combined_in` (Combination)
- `why`: concrete rationale verified against the target
- `evidenceField`: the target's V2 field supporting this relationship
- `relatedProblems`: optional child problem links

`data/knowledge-graph-v1.json` is a **generated read-only projection** of all V2 Typed References plus reviewed Problem links. Existing references become neutral `declared_reference` edges; they must **not** automatically be interpreted as proof that tools are interchangeable or solve the same problem.

Only `data/<type>/<id>.json` and `data/problems/<id>.json` are hand-maintained. Run `node scripts/build-v2.mjs` to rebuild Catalog, Manifest and Graph, then `node scripts/validate-v2.mjs` to verify exact consistency.


## Identity and references

Every record MUST have:

```json
{
  "schemaVersion": 2,
  "id": "stable-kebab-case-id",
  "entityType": "resource|skill|concept|prompt|combination|workflow",
  "title": "Human readable title",
  "status": "active",
  "addedAt": "YYYY-MM-DD",
  "updatedAt": "YYYY-MM-DD",
  "tags": []
}
```

`id` is stable. File names follow the ID. Renaming the display title must not change references.

Cross-entity references use typed references instead of copied objects:

```json
{ "type": "resource", "id": "openai-codex" }
```

Allowed reference types are the six canonical entity types above.

## Entity-specific fields

### Resource

Recommended fields: `canonicalName`, `category`, `resourceType`, `purpose`, `recommendation`, `url`, `repo`, `notes`, `conceptRefs`, `skillRefs`, `workflowRefs`. Optional `legacyMetadata` preserves dated V1 provenance and historical review labels separately from the current `status`. Do not treat historical `installed` or `researchStatus` as present-day facts.

### Skill

Recommended fields: `purpose`, `problem`, `inputs`, `outputs`, `execution`, `resourceRefs`, `conceptRefs`, `workflowRefs`, `source`.

### Concept

Required knowledge fields: `coreProblem`, `solutionMethods`. Optional: `tradeoffs`, `signals`, `antiPatterns`, `exampleRefs`.

### Prompt

Recommended fields: `problem`, `goal`, `prompt`, `inputs`, `expectedOutput`, `constraints`, `conceptRefs`, `workflowRefs`, `resourceRefs`.

### Combination

Combination answers **what works together**, not execution order.

Recommended fields: `goal`, `problem`, `rationale`, `members` (typed refs), `alternatives`, `conceptRefs`, `workflowRefs`.

### Workflow

Workflow answers **how work gets done** and is first-class, not embedded inside Combination.

Recommended fields: `goal`, `problem`, `solutionStrategy`, `stages`, `conceptRefs`, `combinationRefs`, `useCases`, `notes`.

A stage has its own stable ID and typed `uses` references:

```json
{
  "id": "independent-review",
  "title": "Independent Review",
  "purpose": "Use a different model or agent to challenge the first result.",
  "uses": [
    { "type": "resource", "id": "openai-codex" },
    { "type": "prompt", "id": "independent-review" }
  ],
  "outputs": ["review-findings"],
  "gate": "Findings are resolved or explicitly accepted."
}
```

Workflow stages may reference a Combination when several interchangeable tools implement the same capability.

## Separation rules

1. A Resource is not automatically a Skill. Create a Skill only when there is a reusable executable protocol/capability worth discovering independently.
2. A Combination is not a Workflow. Combination = capability bundle; Workflow = ordered problem-solving process.
3. A Prompt is not duplicated merely because a Skill contains instructions. Extract a Prompt only when it is reusable outside that Skill or independently valuable.
4. A Concept must describe a durable problem/solution pattern, not merely restate a product feature.
5. Do not copy full Resource data into Workflow stages. Reference it by ID.
6. One Workflow can use many Combinations; one Combination can support many Workflows.
7. Tool replacement should normally require changing references/alternatives, not rewriting the Concept or Workflow.

## V1 retirement and historical provenance (2026-11-12)

V1 root-level aggregate and intake JSON files were retired from the default branch after the P0 strict parity audit passed. They remain available through Git history and the [P0 pre-cleanup backup branch](https://github.com/christinekao/AI-Tool-Collection/tree/backup/p0-before-legacy-cleanup-20261112).

- **One source of truth:** edit only `data/<type>/<id>.json` for normal ingestion.
- **Generated views:** `data/catalog-v2.json` and `data/manifest-v2.json` are build outputs.
- **Historical metadata:** Resource `legacyMetadata` preserves legacy display/research status, concept review time, other historical fields and the original source-file names. These fields are historical evidence, not current verification.
- **Historical workflow:** a `legacyPurpose` may preserve an older stage description without overwriting a later improved `purpose`.
- **Identity scope:** do not equate an entire repository (e.g. `anthropics/skills`) with one of its component Skills (e.g. `frontend-design`).
- **Parity evidence:** the strict source audit and cleanup record are in [docs/P0_DATA_AUDIT.md](docs/P0_DATA_AUDIT.md). Legacy migration scripts must not be re-run on the current V2 source.

## Future intake rule

New collection flow:

`Research → dedupe → Resource/Skill → Concept → Combination → Workflow → Prompt decision → validate references → publish`

Only entities that add independent knowledge are created. Do not manufacture every entity for every new tool.
