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
6. Workflow analysis
  ↓
7. Prompt extraction
  ↓
8. Update website data
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

Check whether the new item strengthens or creates a reusable multi-tool pattern.

A combination answers:

> What tools or capabilities work well together?

A combination should explain:

- goal
- components
- flow
- use cases

Prefer updating an existing combination when the pattern already exists.

Combination and Workflow are related but not the same thing:

- **Combination** = what capabilities / tools are combined.
- **Workflow** = how the problem is solved in execution order.

Do not replace existing combinations with workflows.

## 6. Workflow Analysis

When a source demonstrates a useful way of solving a problem, do not merely copy another person's sequence of steps. Internalize the workflow into a reusable execution pattern.

Analyze it as:

```text
Goal
  ↓
Problem
  ↓
Solution Strategy
  ↓
Workflow Stages
  ↓
Tool / Capability used at each stage
  ↓
Related Concept
```

The Workflow layer should answer:

1. What problem is being solved?
2. What outcome is the workflow trying to achieve?
3. What strategy makes the workflow effective?
4. What are the execution stages and their order?
5. What tool or capability is used at each stage?
6. Which durable Concept explains why this workflow works?

### Storage model

Workflow is **not a separate source-of-truth file**. Store it as an optional structured layer on a relevant record in `combinations.json`, then expose it independently in the website's Workflow view.

Recommended fields:

```json
{
  "name": "Example Combination",
  "goal": "Desired outcome",
  "problem": "Problem this pattern addresses",
  "solutionStrategy": "General method used to solve it",
  "components": ["Tool A", "Tool B"],
  "workflow": [
    {
      "stage": "Stage name",
      "purpose": "What this stage solves",
      "tools": ["Tool A"]
    }
  ],
  "concepts": ["concept-id"],
  "useCases": []
}
```

`workflow` is optional. Do not invent a fixed sequence when the combination is genuinely unordered.

For older combinations that only have `flow`, the website may use `flow` as a legacy workflow representation until the record is upgraded to the structured schema.

### Source workflow vs reusable workflow

A community post may say:

```text
Tool A → Tool B → Tool C
```

Do not store that sequence only because someone used it. First determine:

```text
What was the goal?
What problem made the workflow necessary?
What method actually solved the problem?
Which stages are reusable beyond those exact tools?
Which tools are examples of the capabilities needed by each stage?
```

Preserve exact tools when useful, but separate the durable method from the current implementation.

## 7. Prompt Extraction

If the source contains a reusable instruction, operating procedure, orchestration method, review method, or prompt pattern that can be executed by an Agent, store it in `prompts.json`.

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

## 8. Relationship Model

The intended knowledge structure is:

```text
Concept
  ↓ implemented by
Tools

Concept
  ↓ combined into
Patterns / Combinations

Combination
  ↓ may expose
Workflow
  ↓ explains
Problem → Solution Strategy → Execution Stages → Tools

Concept
  ↓ operationalized by
Prompts

Tools
  ↔ may participate in multiple Concepts, Combinations and Workflows
```

The website should expose Workflow as its own viewing layer even though the canonical workflow data lives with the related combination. This allows browsing from the question:

> What problem am I solving, and how should the workflow run?

rather than requiring the user to already know the combination name.

## Maintenance Rule

Tools are time-sensitive implementations. Concepts are the durable knowledge layer. Workflows preserve reusable execution logic while still showing the concrete tools that implement each stage.

When tools become outdated, replaced, archived, or renamed, preserve the useful concept, combination and workflow knowledge. Update implementation examples rather than deleting the underlying engineering idea.

## Resource-to-concept traceability

Every resource record must include:

- `concepts`: one or more stable concept IDs from `concepts.json`
- `conceptReviewedAt`: the date the concept mapping was last reviewed

This makes concept coverage auditable from both directions: Concept → examples and Tool → concepts.

## Intake overlay policy

New verified items may first be written to lightweight overlay files so the website can expose them immediately without rewriting large historical datasets on every intake:

- `resources.intake.json` — new or replacement resource records
- `concepts.intake.json` — new concepts plus `examplesAppend` / `solutionMethodsAppend` patches for existing concepts

The website merges these overlays at runtime. Duplicate keys still follow the same canonical merge rules.

Periodically consolidate intake overlays back into the main JSON files during maintenance. The overlay is an ingestion buffer, not a separate knowledge model.

## Backfill status

Concept backfill completed on 2026-09-22. The original 93/93 merged resources were mapped to at least one concept. New intake records must also include concept mappings before they are considered complete.

Workflow viewing layer added on 2026-10-01. Existing `flow` records remain valid and are exposed through the Workflow view as legacy workflow data; new or materially updated combinations should use `problem`, `solutionStrategy`, and structured `workflow` whenever the execution order itself is useful knowledge.
