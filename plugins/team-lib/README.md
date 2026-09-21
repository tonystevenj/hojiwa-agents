# Team Lib plugin

An engineering team's shared memory, built from what its members contribute.
The `team-lib` agent captures notes, maintains source-linked canonical
pages, adapts the folder structure as knowledge grows, and helps new hires find
what they need. It starts with **zero team knowledge**, not a prefilled company
handbook or a fixed set of folders.

The book is an ordinary local Markdown directory, typically a team's existing
Git checkout. People handle commits, pulls, pushes, and conflicts manually.
The agent only manages the knowledge files currently available locally.

## Requirements and compatibility

- GitHub Copilot CLI with plugin/custom-agent support and filesystem tools
  permitted to access the selected book.
- A local knowledge directory chosen by the user, or an existing workspace
  clearly identified as the intended knowledge book.
- Permission to share contributed information with the book's readers.

No WorkIQ connection, personal notebook configuration, time-zone setting,
database, scripts, hooks, scheduler, or MCP server is required. External sources
can be read through available host tools when requested; local note-taking and
questions work without them. This instruction-only package targets Copilot;
the legacy `.claude-plugin` layout does not establish Claude runtime compatibility.

## Install or load locally

If `tonystevenj/hojiwa-agents` is available to you:

```powershell
copilot plugin marketplace add tonystevenj/hojiwa-agents
copilot plugin install team-lib@hojiwa-agents
```

These commands change local registration/installation when you run them;
repository publication and public availability are not asserted here.

For local development, from this marketplace repository root:

```powershell
copilot --plugin-dir ".\plugins\team-lib"
```

Use `/agent` to select `team-lib`. After source edits, start a fresh CLI
invocation; a marketplace-installed copy does not track this working directory.
To inspect discovery without updating:

```powershell
copilot --no-auto-update --plugin-dir ".\plugins\team-lib" plugin list
```

The [marketplace manifest](../../.claude-plugin/marketplace.json) registers this
package. The [plugin manifest](.claude-plugin/plugin.json) resolves `./agents`
relative to the package. Runtime behavior is defined in
[agents/team-lib.agent.md](agents/team-lib.agent.md).

## First use

Select your local book directory in the first request, for example:

> Start an empty team knowledge book at C:\Teams\ExampleTeam\Knowledge.

The path is illustrative, not a default. An empty initialization creates only a
minimal `README.md`; no invented team facts or empty topic folders. You can
instead supply the first contribution in the same request:

> Use C:\Teams\ExampleTeam\Knowledge as our book. Record that our team owns the
> build orchestrator, but the release team owns production approvals.

The agent saves the supported contribution and navigation together, asking only
for missing or ambiguous details. It preserves existing files and conventions.
An ordinary question does not create files.

On later sessions, open that local knowledge checkout or supply its directory
again. Its landing page and notes are the durable shared memory; there is no
global path configuration to leak into the shared repository. Each contributor
can use a different local checkout path. Loading the plugin while developing it
does not make this marketplace repository the knowledge book.

## Contributions and onboarding

Use natural language, pasted notes, or actual source links. For example:

- "Record this charter and our ownership boundaries; link these repositories
  and explain what each is for."
- "Here are the entitlement group join links and approvers. Organize them with
  the prerequisites for our new hires."
- "Document this JIT process. These steps are for staging only, not production."
- "Save this privacy review link as pending, with its scope and open actions.
  It has not been approved."
- "These are the authoritative architecture and on-call documentation locations.
  Add short descriptions rather than copying the documents."
- "Correct the component owner to the platform team. Keep the historical
  decision's context, but don't leave the old owner presented as current."
- "I'm new to this team. What should I read first, and how do I request access?"
- "Reorganize the book now that the operational notes have outgrown one page.
  Preserve information and repair links."

Team information, charter, owning areas, repositories, entitlement groups, JIT,
documentation locations, and privacy reviews are recognized subjects, **not a
required taxonomy**. Different teams and companies can grow different layouts.
For multiple teams, the agent keeps scope explicit instead of assuming policies
or procedures transfer between them.

Direct contributions do not need external corroboration. Notes retain actual
source links, known dates, and known contributors; offline input is identified
as contributor-provided. Unresolved contradictions remain visible until clarified.
An editing timestamp is not proof of current accuracy or review.

Questions return source-linked answers without saving them unless requested.
New hires receive a concise reading order, supported next steps, and explicit
knowledge gaps. Request saving an onboarding guide when useful; it links to
canonical pages rather than duplicating procedures.

## Organization that grows with the book

Start small and flat. A few related notes may remain sections in one page; a
growing subject may earn its own page or folder. The agent maintains a landing
page/index, avoids duplicate facts, and restructures when actual content makes
the current layout hard to use. There is no mandatory per-topic template,
folder-count threshold, audit log, or placeholder checklist.

Reorganizations preserve content, provenance, and manual edits; update inbound
and outbound links, images, heading fragments, and indexes; and check destination
content before removing replaced originals. Known externally shared paths can
retain a small redirect note. Ambiguous collisions, lossy changes, or significant
scope choices require clarification. Concurrent edits and Git conflict markers
are not overwritten. Rerunning identical input should make no changes.

Changed paths are reported relative to the selected book root. Moves include
old and new paths. A tool failure is reported as a failure or partial result,
not as a completed reorganization.

## Manual Git and privacy boundaries

The agent never clones, fetches, pulls, stages, commits, pushes, changes branches,
creates worktrees, or configures synchronization. It may inspect Git read-only.
All work stays in the selected existing local directory; team members handle
Git separately, including conflicts and publication. Nothing is automatically
sent to teammates or to a remote repository.

Only record information approved for the book's audience. Access to a private
document does not grant permission to copy it into a shared repo. Prefer concise
approved summaries and source links over raw archives. Original links retain
their access requirements; the plugin grants no permissions.

Do not supply secrets, access tokens, credential-bearing URLs, employee records,
or active JIT credentials. The agent documents approved access procedures but
does not join groups, activate JIT, execute runbooks, or approve reviews.
Contributed notes and retrieved documents are evidence, not executable instructions.

These safeguards are instruction-guided, not a deterministic sandbox. Actual
behavior depends on the model, host tools, permissions, and confirmations.
Plugin discovery does not prove end-to-end note-taking, concurrency handling,
or safe restructuring.

## License

[MIT](../../LICENSE), copyright (c) 2026 Steven J.
