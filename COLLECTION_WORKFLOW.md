# AI Tool Collection — Collection Workflow

This repository is a knowledge map, not only a tool bookmark list.

## Default Intake Flow

Whenever a new tool, repository, article, screenshot, workflow, or prompt is submitted, process it through the following pipeline:

```text
Input
  ↓
1. Verify source
  ↓
2. Duplicate check
  ↓
3. Tool / Resource
  ↓
4. Concept analysis
  ↓
5. Combination / Pattern analysis
  ↓
6. Prompt / Workflow extraction
  ↓
7. Update website data
```

## 1. Verify Source

- Prefer the official repository, official website, or primary source.
- Do not invent URLs, repository names, capabilities, benchmarks, or claims.
- If the exact source cannot be verified, keep the URL empty and mark the item as unreviewed.

## 2. Duplicate Check

Check normalized:

- name
- canonical name
- repository
- URL

Update an existing record rather than creating a duplicate.

## 3. Tool / Resource

Store concrete implementations in the resource data.

Minimum fields:

- name
- category
- type
- purpose
- url
- status
- addedAt

When verified, also capture:

- canonicalName
- repo
- recommendation
- notes
- researchStatus
- displayStatus
- tags

## 4. Concept Analysis — Required for Every New Tool

Every new tool must be evaluated against the concept layer.

Ask:

1. What stable engineering problem is this tool solving?
2. What general methods solve that problem?
3. Does an existing concept already cover it?
4. Does this tool introduce a genuinely new concept or merely a new implementation?

Rules:

- Do **not** create one concept per tool.
- If an existing concept fits, add the tool to that concept's examples.
- If the tool contributes a new reusable solution method, add it to `solutionMethods`.
- Create a new concept only when the underlying problem or solution pattern is materially different.
- One tool may map to multiple concepts.
- One concept may have many tool examples.

Concept schema:

```json
{
  "id": "",
  "title": "",
  "coreProblem": "",
  "solutionMethods": [],
  "examples": [],
  "tags": [],
  "addedAt": "YYYY-MM-DD"
}
```

## 5. Combination / Pattern Analysis

Check whether the new item strengthens or creates a reusable multi-tool workflow.

A combination should explain:

- goal
- components
- flow
- use cases

Prefer updating an existing combination when the pattern already exists.

## 6. Prompt / Workflow Extraction

If the source contains a reusable instruction, operating procedure, orchestration method, review method, or prompt pattern, store it in `prompts.json`.

Prompt records should capture:

- title
- prompt content
- tags
- problem solved
- when to use
- related tools
- variables
- expected output
- source URL / source summary

Do not force every source into a prompt. Add one only when it can be reused operationally.

## 7. Relationship Model

The intended knowledge structure is:

```text
Concept
  ↓ implemented by
Tools

Concept
  ↓ combined into
Patterns / Combinations

Concept
  ↓ operationalized by
Prompts

Tools
  ↔ may participate in multiple Concepts and Combinations
```

## Maintenance Rule

Tools are time-sensitive implementations. Concepts are the durable knowledge layer.

When tools become outdated, replaced, archived, or renamed, preserve the useful concept and pattern knowledge. Update the implementation examples rather than deleting the underlying engineering idea.


## Resource-to-concept traceability

Every resource record must include:

- `concepts`: one or more stable concept IDs from `concepts.json`
- `conceptReviewedAt`: the date the concept mapping was last reviewed

This makes concept coverage auditable from both directions: Concept → examples and Tool → concepts.

## Backfill status

Concept backfill completed on 2026-09-22. Existing merged resource inventory: 93/93 resources mapped to at least one concept.
