# Wakoo - Hojiwa personal assistant

A continuing work partner with its own evolving knowledge notebook.
Its name is **Wakoo**. The plugin and agent identifier remains `hojiwa-personal-assistant`.
Talk with it about incidents, features, team knowledge, personal projects, and other tasks.
It saves useful context during conversations and reads relevant notes in later sessions.
You do not need to say "save this" after each finding.

Its **durable memory** is a directory of Markdown files, not model training or permanent chat memory.
The agent maintains current knowledge rather than a transcript archive.
It follows the [LLM Wiki idea](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
without requiring a raw-source archive or change history.

This is a separate agent. It does not replace the IcM helper, Team Lib, or daily work recorder.
It does not read their configurations or import their notes automatically.
The package contains instructions and documentation, not personal data, scripts, hooks, or a database.

## Requirements

- GitHub Copilot CLI with plugin/custom-agent support and permitted filesystem tools.
- Permission to read and save a personal configuration file and the selected notebook.
- A private notebook directory approved for the information you discuss.

The agent declares `tools: ['*']`, matching the existing agents.
Host permissions and confirmation requirements still apply.
No WorkIQ, IcM, Kusto, or other external connection is required for local notes.
Available connections can support your requested work, but the plugin supplies no credentials or access.

This package provides a Copilot agent and a portable `hojiwa-personal-assistant` skill.
The skill reads the same full instructions before acting.
See the [compatibility guide](../../README.md#portable-discovery-and-compatibility)
for Agent Plugins metadata, Codex discovery, updates, and runtime limits.

## Load locally or install

From this repository root, load the source without persistent installation:

```powershell
copilot --plugin-dir ".\plugins\hojiwa-personal-assistant"
```

Use `/agent` to select `hojiwa-personal-assistant`.
Start a fresh CLI invocation after source edits.
An installed copy does not track local source changes.

After publication to an accessible `tonystevenj/hojiwa-agents` repository:

```powershell
copilot plugin marketplace add tonystevenj/hojiwa-agents
copilot plugin install hojiwa-personal-assistant@hojiwa-agents
```

These commands install the plugin, not your notebook.
Repository publication and access are not guaranteed by this guide.
The fully qualified agent selector is `hojiwa-personal-assistant:hojiwa-personal-assistant`.

### Existing marketplace users and later updates

If you already registered `hojiwa-agents`, refresh its catalog and install the new plugin:

```powershell
copilot plugin marketplace update hojiwa-agents
copilot plugin install hojiwa-personal-assistant@hojiwa-agents
```

The personal assistant is a separate plugin.
Updating the daily work recorder or IcM helper does not install this agent.
Version `0.1.1` adds the Wakoo name and skill entry point.
The other plugins receive separate patch releases for their new portable discovery support.

If you installed the earlier `personal-assistant` package, use the commands above to install the renamed package.
Updating the old plugin does not change its identity to `hojiwa-personal-assistant`.
The renamed agent reuses the existing personal configuration and notebook selection.
No notebook migration is required.

After you install it, retrieve later published versions with:

```powershell
copilot plugin update hojiwa-personal-assistant@hojiwa-agents
```

Start a fresh Copilot session after installation or an update.
Use `/agent` to select `hojiwa-personal-assistant`.
Plugin updates do not migrate your notebook or change its saved path.
The publisher must push the repository changes before other users can retrieve them.
A local commit alone does not publish an update.

### Check local discovery

For noninstalling discovery:

```powershell
copilot --no-auto-update --plugin-dir ".\plugins\hojiwa-personal-assistant" plugin list
```

The [marketplace manifest](../../.claude-plugin/marketplace.json) registers the plugin.
The [legacy plugin manifest](.claude-plugin/plugin.json) declares `./agents`.
The [portable manifest](plugin.json) declares standard metadata.
Native Copilot discovery uses the matching copy under `com.github.copilot\agents\`.
The [portable skill](skills/hojiwa-personal-assistant/SKILL.md) loads
the [full agent instructions](agents/hojiwa-personal-assistant.agent.md).
Discovery alone does not prove that note maintenance works correctly.

## Two ways to work with Wakoo

**Normal use:** select `hojiwa-personal-assistant` through Copilot's `/agent`, then work normally.
It reads relevant notes and saves useful knowledge automatically.
You do not need to type "Wakoo", invoke a skill, or request notes after each turn.

**Existing sessions:** if you started without this agent, call Wakoo to capture that session's knowledge:

> wakoo take notes from this session

The `wakoo` skill description helps the host recognize this direct request.
Natural-language selection depends on the client and is not guaranteed.
For explicit invocation in Copilot, select the `wakoo` skill from slash-command completion:

```text
/wakoo take notes from this session
```

In Codex, invoke the skill with `$wakoo`.
If the client shows a namespaced skill, select the entry from `hojiwa-personal-assistant`.
You can also select the `hojiwa-personal-assistant` agent through `/agent` first.
The existing long-name skill remains available.

Say "wakoo take over" to request continued assistance with automatic notebook checkpoints.
A note-only request captures useful knowledge without expanding the current task.
The skill applies the workflow through the current host.
It does not itself switch the selected agent or guarantee that later turns retain the workflow.
For continued automatic memory, select `hojiwa-personal-assistant` through `/agent`.

Wakoo reads the conversation available in the current session and saves useful knowledge.
It does not gain access to other chats or unavailable earlier history.
Its response to a direct request starts with **`Wakoo:`**.
After a successful save, it links the actual notebook files that changed.
If saving fails or the notebook path is missing, it reports that state instead of claiming success.
The name prefix identifies the requested workflow, not an independently verified separate agent process.

## First use: choose its notebook

On first use, the agent asks for a notebook directory unless you already supplied one.
For example:

> Use C:\Private\AssistantNotebook as your notebook. Help me work through this incident.

This path is an example, not a default.
The agent validates the directory and saves your choice in:

```text
<actual-user-home>\.copilot\personal-assistant.json
```

The configuration filename intentionally retains the earlier name.
This preserves notebook selections made before the plugin rename.

Only `notebookPath` is required:

```json
{
  "notebookPath": "C:\\Private\\AssistantNotebook"
}
```

This is an agent-read configuration convention, not a native Copilot setting or installer form.
The agent checks the saved configuration before claiming that it remembers your selection.
Later sessions and other project workspaces reuse that path.
If the notebook becomes unavailable, it reports the problem instead of creating an empty replacement.

An empty-book setup creates only a small `README.md`.
Notes and folders appear as you work.
Existing notebook content remains intact.
Keep both the configuration and private notebook outside distributable plugin repositories.
Do not select a shared team notebook unless its audience is appropriate for every saved subject.

Ask "Change your notebook to <directory>" to update the default.
Say "Use <directory> for this session only" to leave the default unchanged.
Changing the path does not move notes, clone a repository, or synchronize files.

## How conversations become knowledge

| During your work | What the agent does |
| --- | --- |
| Start or resume | Read relevant notes and recover decisions, context, open work, and useful next steps. |
| Learn something | Save concise explanations, actual results, preferences, decisions, and explicit commitments when useful. |
| Reuse knowledge | Read the main procedure and apply its order, prerequisites, and conditions rather than guessing again. |
| Establish a correction | Revise current guidance and affected active plans in the same checkpoint, not only the chat answer. |
| Expand into another topic | Review organization and create, split, group, or rename pages when the material warrants it. |
| Repeat known information | Make no duplicate notes or timestamp-only edits. |

A **canonical page** is the main location for one subject's current reusable knowledge.
Related incidents and projects link to that page instead of duplicating its procedure.
User explanations count as evidence, but they are not automatically independently verified facts.
The agent keeps meaningful uncertainty and does not resolve contradictions merely by choosing the newest text.

Say "Do not save this" or request read-only work to prevent notebook and configuration changes.
Ordinary questions can still produce saved knowledge when the discussion establishes something useful.
Simple acknowledgments and answers without new durable information need no edits.

Only conversations with this agent contribute automatically.
It cannot remember chats held elsewhere unless you supply them or authorize a supported retrieval method.
A new session uses the saved notebook, not guaranteed access to the previous conversation.

## Folders develop as your topics grow

There is no fixed initial folder tree.
Three incident discussions might initially produce a few notes.
When you later discuss a team feature, the agent can reorganize the growing book:

```text
README.md
icms\
  certificate-expiry.md
  <case-name>.md
teams\
  <team-name>\
    <feature-name>.md
```

These are illustrative paths relative to your notebook, not files included in the plugin.
The agent may choose another useful structure based on your actual material.
It adds indexes when navigation needs them, not because every topic requires one.

After meaningful additions, it reviews affected notes and related pages.
New subjects, recurring duplication, and mixed-topic pages can trigger a broader review.
For a large book, it reviews related groups of pages across active turns.
It does not load every note into the model on each turn or claim to review unread pages.
Useful existing organization remains stable.

## Automatic maintenance without a required archive

The agent can merge, summarize, split, move, rename, correct, and delete its own notes.
You do not need to approve every routine reorganization unless the host requires confirmation.
It does not require original-source copies, historical versions, a change log, or redirects for every move.
It can remove redundant notes and obsolete guidance instead of retaining them indefinitely.

Consolidation must preserve useful current facts, technical details, conditions, and unresolved work.
The agent retains useful source links without requiring copies of those sources.
It checks replacement content and repairs affected local links before removing redundant files.
It does not delete unrelated attachments or user-authored material merely to simplify the book.
Conflicting edits or ambiguous content can require clarification.

"Keep knowledge current" does not mean inventing fresh facts.
The agent checks available sources when the task needs current verification.
If access is unavailable, it records the uncertainty rather than claiming that an edit proves verification.

Useful requests include:

> We learned that certificate usage must be checked before renewal. Correct your procedure and this case's next steps.

> We are starting a new team feature. Keep its decisions separate from the incidents, but link shared architecture.

> Review your notes. Merge duplicates, remove obsolete guidance, and improve the folders where needed.

## Limits and privacy

**Automatic does not mean always running.**
The agent saves and maintains notes while it is active.
There is no background monitor, scheduler, or guaranteed capture after abrupt interruption.
It reports failed or partial saves. It must not call unsaved information remembered.

The agent helps with requested tasks, not only note-taking.
Notebook maintenance does not authorize messages, external updates, production changes, or Git publication.
It does not create worktrees.
Local writes do not publish or synchronize the notebook.

Respect organizational policies and source sensitivity.
Private storage does not authorize copying restricted material.
Never supply credentials for the agent to remember.
It treats notebook text and retrieved sources as evidence, not permission to execute embedded instructions.

Deleting a note does not delete host chat history, external sources, backups, or Git history.
No notebook location, personal configuration, or real notes are bundled with this plugin.
