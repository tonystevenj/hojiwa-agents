# hojiwa-agents

A portable GitHub Copilot CLI plugin marketplace maintained by
[tonystevenj](https://github.com/tonystevenj) (Steven J). Packages contain agent
instructions and documentation, not personal notebooks, credentials, or work data.

## Catalog

| Plugin | Purpose |
| --- | --- |
| [daily-work-notebook](plugins/daily-work-notebook/README.md) | One personal, source-linked notebook across projects, with WorkIQ evidence, protected manual additions, and all host-provided tools. |
| [team-lib](plugins/team-lib/README.md) | A shared engineering knowledge book that starts empty, grows its own organization, and helps new hires; Git syncing stays manual. |
| [managed-apps-team-icm-helper](plugins/managed-apps-team-icm-helper/README.md) | An IcM troubleshooting partner that checkpoints a shared notebook, learns product knowledge, and supports DRI rotation handoffs. |
| [hojiwa-personal-assistant](plugins/hojiwa-personal-assistant/README.md) | A personal work partner that remembers useful conversation knowledge and automatically organizes, corrects, merges, and prunes its private notebook. |

## Repository layout

```text
.claude-plugin\marketplace.json
.agents\plugins\marketplace.json
plugins\daily-work-notebook\
  plugin.json
  .claude-plugin\plugin.json
  agents\work-recorder.agent.md
  com.github.copilot\agents\work-recorder.agent.md
  skills\work-recorder\SKILL.md
  README.md
plugins\team-lib\
  plugin.json
  .claude-plugin\plugin.json
  agents\team-lib.agent.md
  com.github.copilot\agents\team-lib.agent.md
  skills\team-lib\SKILL.md
  README.md
plugins\managed-apps-team-icm-helper\
  plugin.json
  .claude-plugin\plugin.json
  agents\managed-apps-team-icm-helper.agent.md
  com.github.copilot\agents\managed-apps-team-icm-helper.agent.md
  skills\managed-apps-team-icm-helper\SKILL.md
  README.md
plugins\hojiwa-personal-assistant\
  plugin.json
  .claude-plugin\plugin.json
  agents\hojiwa-personal-assistant.agent.md
  com.github.copilot\agents\hojiwa-personal-assistant.agent.md
  skills\hojiwa-personal-assistant\SKILL.md
  README.md
scripts\validate-plugin-compatibility.mjs
.github\workflows\plugin-compatibility.yml
LICENSE
README.md
```

The [marketplace manifest](.claude-plugin/marketplace.json) retains the legacy
marketplace layout. Each `./plugins/<plugin-name>` source is relative to this
repository root. Each nested legacy plugin manifest resolves `./agents` from its
package root. Root `plugin.json` files provide Agent Plugins metadata.
See [portable discovery and compatibility](#portable-discovery-and-compatibility)
for the client-specific behavior and limits.

## Install or develop locally

If the intended repository `tonystevenj/hojiwa-agents` is available to you:

```powershell
copilot plugin marketplace add tonystevenj/hojiwa-agents
copilot plugin install daily-work-notebook@hojiwa-agents
copilot plugin install team-lib@hojiwa-agents
copilot plugin install managed-apps-team-icm-helper@hojiwa-agents
copilot plugin install hojiwa-personal-assistant@hojiwa-agents
```

These are installation instructions, not a claim that the repository has been
published or verified publicly accessible. Run them only when you intend to
change your own registration/installation.

If you already registered this marketplace, refresh its catalog before installing
a newly added plugin:

```powershell
copilot plugin marketplace update hojiwa-agents
copilot plugin install hojiwa-personal-assistant@hojiwa-agents
```

Each catalog entry is a separate plugin. Updating an installed plugin, including
`daily-work-notebook` or the IcM helper, does not install `hojiwa-personal-assistant`.
After installing it, start a fresh Copilot session and select it through `/agent`.
For later updates to an already installed personal assistant:

```powershell
copilot plugin update hojiwa-personal-assistant@hojiwa-agents
```

These commands retrieve published changes. A local Git commit alone does not
make a plugin available to other users.

The former `personal-assistant` package is now `hojiwa-personal-assistant`.
Install the renamed package explicitly rather than updating the old identity.
Its existing personal configuration and notebook selection remain valid.

For local development, run from this marketplace repository root:

```powershell
copilot --plugin-dir ".\plugins\daily-work-notebook"
```

Use `/agent` to select `work-recorder`. Invocation-time loading does not
persistently install or enable the plugin. See the
[self-contained plugin guide](plugins/daily-work-notebook/README.md) for host
requirements, your own WorkIQ connection and permissions, first-use setup,
manual/query/weekly examples, optional scheduling, and privacy limits.

Before notebook access the daily work agent reads the personal convention
`<actual-user-home>\.copilot\work-recorder.json`, with user-selected
`notebookPath` and `timeZone` settings shared across projects. This is read by
the agent's instructions, not native Copilot settings or an installer form.
There is no default notebook location, bundled scheduler, or packaged work data.
Avoid storing private config and notebook content in distributable repositories.

The daily work agent declares `tools: ['*']` and adds no plugin-specific tool bans. Shell
validation, Git, plugin edits, and other user-requested operations are supported,
subject to host permissions and confirmation requirements.

For Team Lib, load `.\plugins\team-lib` instead and
select `team-lib` with `/agent`. Choose a local knowledge directory, or
open an existing knowledge repo. It needs no personal notebook config or WorkIQ
connection. Team members feed it notes; it maintains a navigable Markdown book
and adapts folders to the material. It only manages local knowledge files, not
Git commits, branches, worktrees, or synchronization. See the
[team knowledge guide](plugins/team-lib/README.md) for setup,
contribution examples, restructuring, and shared-repo privacy.

For IcM DRI rotation, load `.\plugins\managed-apps-team-icm-helper` and select
`managed-apps-team-icm-helper` with `/agent`. Choose an approved shared notebook
directory once; the agent saves your local `notebookPath` in the personal config
`<actual-user-home>\.copilot\managed-apps-team-icm-helper.json` and reuses it across
sessions and projects. Each teammate keeps their own config outside the shared
book. The agent starts with zero product knowledge, checkpoints meaningful
findings during investigation, and links
per-incident evidence to reusable telemetry, architecture, and troubleshooting
pages. Incoming DRIs resume from saved notes, not the previous chat. No IcM or
Kusto connection is bundled; manual findings work without either. People own
Git synchronization and publication. See the
[IcM helper guide](plugins/managed-apps-team-icm-helper/README.md) for installation,
team onboarding, investigation examples, rotation handoffs, and safety limits.

For a continuing personal assistant, load `.\plugins\hojiwa-personal-assistant` and
select `hojiwa-personal-assistant` with `/agent`. It asks for a notebook directory on
first use and saves the selection in
`<actual-user-home>\.copilot\personal-assistant.json` for later sessions and projects.
This is a separate agent-read configuration convention, not a native Copilot setting.
The configuration filename remains unchanged to preserve selections made before the plugin rename.
It saves useful knowledge during conversations, applies learned corrections,
and lets folders develop as topics grow. It can merge, summarize, reorganize,
and delete its own notes without requiring a source archive or change history.
Maintenance occurs while the agent runs, not through background monitoring.
Existing agents and their notebooks remain separate. See the
[personal assistant guide](plugins/hojiwa-personal-assistant/README.md) for setup,
examples, privacy, and memory limits.

## Portable discovery and compatibility

All four packages declare the
[Agent Plugins 1.0.0 format](https://agent-plugins.org/specification).
A **manifest** is the JSON file that declares a plugin's identity and version.
The portable manifest is `plugin.json` at each plugin root, not `.plugin/plugin.json`.
Legacy manifests remain in place for existing Copilot discovery.
The personal assistant's explicit rename requires installation under its new identity.

| Package location | Purpose |
| --- | --- |
| `plugin.json` | Standard metadata, without client-specific `agents` or `skills` fields. |
| `.claude-plugin\plugin.json` | Matching metadata plus the existing legacy `agents` location. |
| `agents\*.agent.md` | Shared source instructions and legacy Copilot discovery. |
| `com.github.copilot\agents\*.agent.md` | Matching agent copies for native Copilot discovery. |
| `skills\<name>\SKILL.md` | Portable skill entry point that reads the full shared instructions before acting. |

The standard defines skills and MCP servers, not portable custom agents.
Other compatible clients use the packaged skills, not Copilot's `/agent` selector.
These skills are workflows that load the same notebook instructions.
They do not register a persistent custom agent in every client.
No MCP server or hooks are bundled, and no model override is added.
Tool availability, permissions, and required connections still depend on the host.
The existing personal configuration paths remain unchanged across clients.

The [Codex marketplace](.agents/plugins/marketplace.json) follows the
[Codex packaging guide](https://developers.openai.com/plugins/build/plugins).
Its entries point to the same four plugin directories as the legacy marketplace.
For local evaluation, from this repository root:

```powershell
codex plugin marketplace add "."
```

For a published Git-backed marketplace:

```powershell
codex plugin marketplace add tonystevenj/hojiwa-agents --ref master
```

Use the Plugins Directory in a supported ChatGPT desktop app with Codex plugin support.
Select `hojiwa-agents`, install the desired plugin, and start a new session.
Use its skill through the client's skill controls.
Refresh an existing Git-backed catalog with:

```powershell
codex plugin marketplace upgrade hojiwa-agents
```

Client support and installation surfaces can vary.
Package validation does not establish end-to-end Codex, Claude, or notebook runtime behavior.
No user profile is installed or changed by the repository validation command.

### Versions and package maintenance

| Plugin | Version |
| --- | --- |
| `daily-work-notebook` | `0.2.1` |
| `team-lib` | `0.1.1` |
| `managed-apps-team-icm-helper` | `0.1.3` |
| `hojiwa-personal-assistant` | `0.1.0` |

Existing plugins receive patch releases for the additional discovery files and skills.
The personal assistant remains a separate initial release.
Updating another plugin still does not install it.
Keep versions and metadata consistent across both manifests and the legacy catalog.
Ordinary version updates must preserve marketplace and plugin identities.
An intentional rename, such as the personal assistant rename, requires installing the new identity.

Edit full instructions under `agents\`, not the native compatibility copies.
After changing instructions, regenerate the native copies and check all packages:

```powershell
node scripts/validate-plugin-compatibility.mjs --sync
node scripts/validate-plugin-compatibility.mjs
```

The first command writes only generated native agent copies, then validates the packages.
The second command is read-only and fails on inconsistent manifests, catalogs, copies, skills, or local links.
It uses Node.js built-in modules and needs no package installation.
The [compatibility workflow](.github/workflows/plugin-compatibility.yml) runs the read-only check on Windows and Ubuntu.
There are no packaged unit tests or new runtime dependencies.

## License

[MIT](LICENSE), copyright (c) 2026 Steven J.
