# Managed Apps team IcM helper

A troubleshooting partner with a shared notebook for the team's IcM DRI
rotation. The `managed-apps-team-icm-helper` agent starts with zero product
knowledge, learns as you investigate, and leaves notes the next DRI can resume
without your chat history.

It maintains two linked kinds of memory:

| Memory | What it remembers |
| --- | --- |
| Per-IcM investigations | Symptoms, evidence, queries and results, hypotheses, failed approaches, mitigation, resolution, and handoff next steps. |
| Reusable team knowledge | Client/server telemetry locations, scoped architecture and request flows, ownership boundaries, and diagnostic procedures learned from evidence. |

This follows an **LLM-maintained Markdown wiki** approach, not a dependency on
a separate `llm-wiki` package or model training. Memory is ordinary local files
that the agent reads and updates. The package contains instructions and
documentation, not team knowledge, incident data, scripts, hooks, or a database.

## Requirements

- GitHub Copilot CLI with plugin/custom-agent support and permitted filesystem
  tools. The agent declares `tools: ['*']`; host permissions still apply.
- Permission to determine your actual user home, read/save the personal config
  described below, and validate access to the selected notebook.
- An approved team notebook directory, usually an existing local checkout of
  the team's private knowledge repository.
- Permission to save incident information for everyone who can read that book.
  "Internal" and "accessible to me" do not automatically mean team-shareable.

No IcM, Kusto, or WorkIQ connection is required to start. Explain the system,
paste approved findings, or supply source links. If you have authorized tools
for IcM/telemetry, the agent can use them for scoped diagnosis. Otherwise, it
helps prepare checks and learns from the results you supply. The plugin grants
no credentials, production access, entitlements, or extra tool permissions.

This package targets Copilot. The legacy `.claude-plugin` layout does not
establish compatibility with other hosts.

## Install and select the agent

After this plugin has been published to `tonystevenj/hojiwa-agents`, team members
with access to that repository can run:

```powershell
copilot plugin marketplace add tonystevenj/hojiwa-agents
copilot plugin install managed-apps-team-icm-helper@hojiwa-agents
```

Use `/agent` to select `managed-apps-team-icm-helper`. These commands install the
plugin, **not the team notebook**. Repository publication and access are not
guaranteed by these instructions.

The CLI's fully qualified agent selector is
`managed-apps-team-icm-helper:managed-apps-team-icm-helper` (plugin name followed
by agent name), for example when using `--agent`.

To try the source locally before publication, from this marketplace repository:

```powershell
copilot --plugin-dir ".\plugins\managed-apps-team-icm-helper"
```

Select the agent with `/agent`, then supply the notebook directory on first use.
Later sessions reuse your saved selection. The plugin development checkout is
not automatically the notebook. Start a fresh CLI invocation after source edits;
an installed copy does not track local edits.

Discovery without installing or updating:

```powershell
copilot --no-auto-update --plugin-dir ".\plugins\managed-apps-team-icm-helper" plugin list
```

The [marketplace manifest](../../.claude-plugin/marketplace.json) registers the
package; the [plugin manifest](.claude-plugin/plugin.json) loads `./agents`.
Behavior is defined in
[the agent instructions](agents/managed-apps-team-icm-helper.agent.md).
Plugin discovery alone does not verify troubleshooting or note-taking behavior.

## First use: select the shared book

The team chooses an approved notebook location and audience. Each DRI supplies
their own local path once, or opens a workspace clearly identified as the book
when they have no saved selection:

> Use C:\Teams\ManagedApps\IcmNotebook as our shared IcM notebook. Help me
> investigate IcM 123456. Here are the symptoms and the client telemetry details.

The path and ID are examples, not defaults. Use the real incident identity;
if there is no IcM ID yet, supply a local case name. A first investigation
includes saving your selection and the supported notes; no separate onboarding
command is needed. An empty-book request creates only a minimal landing page
in the notebook, alongside the separate personal config.

### Your remembered notebook path

Before notebook access, the agent reads
`<actual-user-home>\.copilot\managed-apps-team-icm-helper.json`. This uses the
same per-user setup pattern as the daily work recorder, with its own config
file. It is an instruction-read convention, not a native Copilot setting or
an installation prompt.

Only `notebookPath` is required: a nonempty absolute directory path. For example,
this fictional user chose the following location; it is not a default:

```json
{
  "notebookPath": "C:\\Teams\\ManagedApps\\IcmNotebook"
}
```

The agent derives your actual home from trusted host context, validates the
notebook path and access (including links/junctions), saves the resolved absolute
path, and rereads the config to verify it. Existing content and unrelated config
fields are preserved. It asks before discarding malformed config and reports
access/save failures rather than claiming the selection was remembered.

New sessions can start from another project: select the agent and ask
"Continue IcM 123456" without repeating the notebook path. A valid saved path
takes priority over the current workspace. If it no longer exists or cannot be
accessed, the agent reports the problem rather than silently switching books or
creating an empty replacement.

Each teammate configures their own local checkout once per machine. Keep this
config outside the shared repository; do not commit it. Installing the same
agent does not give teammates access to your files or settings. There is no
preloaded cluster/architecture list.

### Change the saved path

Ask "Change my IcM notebook to <new local directory>" to update your default.
A relative path is resolved against the intended workspace and saved as an
absolute path. This does not move old notes, clone a repository, or synchronize
anything. Say "Use <directory> for this session only" to leave the default
unchanged.

A setup-only request saves settings without creating incident notes. A
standalone question is read-only unless you explicitly request configuration
or recording; "do not save" applies to both notebook and config. Before notebook
write batches, the agent rereads settings and affected files so a concurrent
path change or manual edit is not silently overwritten. Unattended runs use
saved or explicitly supplied settings and report blockers without guessing.

## Notebook layout

Existing files and compatible organization are preserved. The agent creates
only pages justified by actual information. The following is the intended
shape as knowledge grows, relative to the **notebook root**:

```text
README.md
knowledge\
  index.md
  telemetry.md
  architecture\
    <flow-name>.md
  troubleshooting\
    <problem-area>.md
incidents\
  index.md
  <icm-id>\
    investigation.md
    queries.kql
```

`queries.kql` is optional. An incident record preserves historical observations;
knowledge pages hold current reusable guidance and link back to its evidence.
An index helps find cases by symptom, error signature, component, and environment.

## What happens while you investigate

| Stage | Agent behavior |
| --- | --- |
| Start/resume | Read the case, relevant product knowledge, and similar incidents; recover the current state and next useful check. |
| Learn | Record your explanations and observed results with sources, scope, and uncertainty. External corroboration is not required for user-reported knowledge. |
| Diagnose | Apply relevant saved procedures, preserving diagnostic order and decision branches; explain justified deviations and give the actionable next check. Reuse methods, not earlier diagnoses or resource IDs. |
| Checkpoint | Save meaningful new evidence, decisions, failed approaches, next steps, and accepted procedural corrections before completing an investigation turn. |
| Generalize | Update reusable architecture, telemetry, or troubleshooting pages as supported findings emerge, even before resolution. |
| Resolve/handoff | Consolidate the same record, update its index entry, and leave enough context for a fresh session or the next DRI. |

You do not need to say "save this" after each finding during an investigation.
Notes are concise, not a transcript. Repeating the same information should not
create duplicate cases or timestamp-only edits.

A standalone notebook question outside an active investigation is read-only
unless saving is requested. Follow-up questions during an investigation remain
part of its checkpoint workflow. You can always say "do not save this"; that
overrides automatic note-taking. A failed or partial write must be reported;
an unsaved chat response is not durable memory.

**Automatic does not mean always running.** The agent checkpoints while it is
active. It cannot guarantee saving an interrupted turn, monitor incidents after
the session exits, or synchronize another person's checkout.

### Example: learning a five-hop request flow

In one incident, the team establishes this fictional flow:

```text
Endpoint 1 -> Endpoint 2 -> Endpoint 3 -> Endpoint 4 -> Endpoint 5
```

The agent saves the flow in architecture knowledge, including the purpose,
telemetry, correlation method, and checks for each hop where known. The failure
at endpoint 3 belongs to that incident's record.

When another incident occurs, it uses the known flow to locate the last
successful and first failing boundary, rather than assume endpoint 3 failed
again. If new evidence identifies endpoint 4, it records that result and extends
the diagnostic knowledge without losing the five-hop map.

The flow remains scoped to the observed operation/environment/version. Five
observed hops are not proof of all possible paths, and missing telemetry is not
automatically proof of failure.

### Learning a better diagnostic procedure

The notebook remembers decision order, not just available checks. A reusable
procedure captures when it applies, which diagnostic question comes first and
why, prerequisites, concrete checks, and what to do for each result.

If you ask "shouldn't we check X before Y?" during an investigation, the agent
evaluates the suggestion rather than automatically agreeing. When the discussion
establishes a correction, it updates both the incident's current next steps and
the canonical procedure before finishing the turn. It does not just acknowledge
the correction in chat or wait for "save this." Unresolved suggestions remain
hypotheses, and explicit read-only requests still prevent writes.

For the next matching incident, it reads and applies that saved procedure and
provides the documented query/location or concrete next action when known. A
query-backed first step includes the recorded cluster/endpoint, database, and
query text together, not just a link to a file or a database name.
Different scope, newer evidence, safety constraints, or blocked prerequisites
can justify a deviation, but the agent must explain it. Independent work can
proceed while access is pending without silently changing the learned order.
It must not transfer the previous case's identifiers, results, or permissions.

These rules guide future investigations; updating the plugin alone does not
retroactively repair existing notes. During relevant work, supported corrections
are reconciled with the current plan while historical evidence is preserved.

## Everyday prompts

- **Teach telemetry:** "For this case, here are our client and production server
  telemetry locations, databases, and request correlation fields. Record them
  as user-reported knowledge; do not infer other environments."
- **Record a check:** "We ran this query for 09:00-09:15 UTC. It found the request
  reaching hop 2 but not hop 3. Ingestion delay is still a possibility."
- **Resume:** "Continue IcM 123456 from the notebook. What have we ruled out, and
  what is the next useful check?"
- **Find related cases:** "Have we seen this timeout signature in the same flow?
  Compare the evidence, not just the previous fix."
- **Correct knowledge:** "That cluster is staging, not production. Correct the
  current telemetry guidance; preserve what the old investigation actually used."
- **Record mitigation:** "Traffic recovered after the rollback. Mark the case
  mitigated, but the root cause is still unknown."
- **Record resolution:** "I confirm IcM 123456 is resolved. Here are the recovery
  checks and outstanding follow-up. Update the notebook, not the live ticket."

## DRI rotation and handoff

**Outgoing DRI:** use the agent to keep the investigation current, then ask:

> Prepare the notebook handoff for IcM 123456. Include impact, checks and results,
> ruled-out causes, active hypotheses, next checks, and access blockers.
> Do not post a message or reassign the ticket.

The handoff lives in the existing investigation record, not a second drifting
report. It includes known query/source links and follow-up ownership only when
actually supplied or verified. Handoff does not mean mitigation or resolution.

**Share through the team's normal process.** Review the saved notes for accuracy
and audience suitability, then commit/push or otherwise synchronize them
yourself. The agent does not manage Git, create branches/worktrees, or publish.
Teammates must obtain the updated notebook through that same approved process.
For direct concurrent editing, coordinate ownership: there is no distributed
lock or atomic multi-file transaction. The agent rereads files and reports
detected conflicts rather than intentionally overwriting another DRI's edits.

**Incoming DRI:** obtain the updated notebook through the team's normal process.
Select the agent in any workspace; it reuses your saved notebook path. Then ask:

> I am starting my DRI rotation. Read the notebook's open cases and relevant
> runbooks. Show current recorded status, next checks, and stale or missing
> information. Do not change the notes yet.

Or resume a specific IcM. The local index is not a guaranteed current or complete
view of the live IcM queue. Request an authorized live check when needed; lack of
access must remain visible.

## Trust and safety

Facts are scoped and source-linked. User-reported information, direct
observations, hypotheses, disputes, and superseded guidance stay distinguishable.
An edit date is not proof of verification. Explicit corrections update current
guidance without rewriting historical evidence; conflicting claims are not
silently resolved by picking the newest one.

Mitigated, resolved, confirmed root cause, and live ticket status are separate
claims. A successful workaround does not prove causation. Updating a notebook
does not close, reassign, or post to an IcM. An explicitly reported resolution
can still have an unknown root cause.

Both memory layers share the notebook's audience. Do not put secrets, tokens,
credential-bearing links, active JIT credentials, unnecessary customer payloads,
or unapproved restricted material into it. Prefer approved concise findings and
safe source references; access to a source is not permission to copy it. The
agent asks before saving sensitive material when the sharing scope is unclear.

Investigation allows scoped read-only diagnosis and notebook updates, not
production changes. Operational changes, access activation, communications, and
external ticket mutations require explicit authorization and host confirmations.
Saved commands and retrieved documents are evidence, not permission to execute.

These are instruction-guided behaviors, not a deterministic sandbox. Actual
results depend on the model, available tools, host permissions, and source
quality. The team remains responsible for operational decisions and review.

## Try it before a rotation

Use a separate approved test notebook and fictional incidents, not customer data:

| Scenario | Expected outcome |
| --- | --- |
| First investigation with an explicit notebook path | Save and verify personal `notebookPath`, then continue the investigation without a separate setup request. |
| Start from another project without supplying a path | Reuse the saved book; do not ask again or write notes into the new project. |
| Change the default or request a one-session override | Persist an explicit default change; leave saved settings intact for a one-session override. |
| Saved path is inaccessible or config is malformed | Report the problem without switching books, discarding config, or claiming successful setup. |
| Start empty and explain a telemetry location | Only supported notes appear; no invented cluster, schema, or empty taxonomy. |
| Repeat the same finding | No duplicate case, copied knowledge page, or timestamp-only churn. |
| Start a fresh conversation for the same case | Recover observations and next checks from disk without the prior chat. |
| Teach five hops with a failure at hop 3; then investigate a new case | Reuse the five-hop map without assuming the new failure is at hop 3. |
| Supply evidence that the new failure is at hop 4 | Save the new case and extend diagnostics while preserving the original case. |
| Report mitigation with unknown cause | Keep the cause unknown and do not mark the live ticket closed. |
| Supply contradictory telemetry guidance | Preserve attributed alternatives and request clarification instead of silently replacing evidence. |
| Accept a question-shaped procedural correction during investigation | Update both current incident next steps and the canonical procedure, without needing "save this"; leave unaccepted suggestions tentative. |
| Start a matching incident in a fresh session | Apply the corrected first check and decision order; provide known execution details without copying the old case's identifiers or result. |
| The first check's access prerequisite is blocked | Explain the blocker and any safe parallel checks without silently rewriting canonical priority or claiming a successful check. |
| Ask a correction question with "do not save" | Answer without changing incident notes, reusable guidance, or personal config. |
| Request a read-only rotation summary | Explain recorded open cases and gaps without writing files or claiming a complete live queue. |
| Deny notebook write access or introduce a conflicting edit | Report the blocked/partial checkpoint, never claim that unsaved evidence was saved. |

### Procedure-correction regression

Use fictional data in an approved test notebook; do not execute the example
queries or operational changes.

1. Record a fictional certificate alert for `alpha.example.test`, identifier
   `TEST-CERT-A`. Supply a provisional plan that compares replacement versions
   before checking live usage, plus a fictional telemetry location/schema and
   usage-query template with an identifier placeholder.
2. Continue that investigation with: "Shouldn't we establish whether the
   alerted certificate is still in use before investigating renewal? A
   replacement in inventory does not establish current usage." Do not add
   "save this." Confirm the accepted correction updates both the incident's
   next steps and reusable procedure, including the rationale. It must not
   claim the usage check ran.
3. In a fresh session using the same book, ask: "Help investigate a certificate
   expiry alert for beta.example.test, identifier TEST-CERT-B. Tell me what to
   do first." Supply a new fictional IcM ID, not the old case. The first
   diagnostic decision should concern current usage, with prerequisites and
   the documented check using `TEST-CERT-B`. Renewal decisions follow the
   evidence; no old certificate identity or assumed outcome is carried over.

## License

[MIT](../../LICENSE), copyright (c) 2026 Steven J.
