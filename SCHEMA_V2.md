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

Recommended fields: `canonicalName`, `category`, `resourceType`, `purpose`, `recommendation`, `url`, `repo`, `notes`, `conceptRefs`, `skillRefs`, `workflowRefs`.

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

## Migration source precedence

Legacy files remain read-only migration sources until parity is verified:

1. Canonical modular record already under `data/` (highest precedence)
2. `*.updates.json`
3. `*.intake.json`
4. Legacy canonical aggregate (`resources.json`, `concepts.json`, `combinations.json`, `prompts.json`)

Merge by stable ID where available; otherwise normalize repo/URL/name and flag ambiguous collisions for review. Never silently discard conflicting non-empty fields.

## Migration acceptance

Migration is complete only when:

- every legacy record is represented by a V2 canonical record or an explicit dedupe/alias decision;
- no dangling typed references exist;
- duplicate repo/URL/IDs are reported and resolved;
- Workflow records are first-class files;
- existing structured workflow information is preserved when extracted from legacy Combinations;
- legacy and V2 record counts reconcile through a generated migration report;
- the website reads V2 data and all six entity views work;
- old aggregate/intake/update files are retained until the above checks pass.

## Future intake rule

New collection flow:

`Research → dedupe → Resource/Skill → Concept → Combination → Workflow → Prompt decision → validate references → publish`

Only entities that add independent knowledge are created. Do not manufacture every entity for every new tool.
