# hojiwa-agents

A portable GitHub Copilot CLI plugin marketplace maintained by
[tonystevenj](https://github.com/tonystevenj) (Steven J). Packages contain agent
instructions and documentation, not personal notebooks, credentials, or work data.

## Catalog

| Plugin | Purpose |
| --- | --- |
| [daily-work-notebook](plugins/daily-work-notebook/README.md) | One personal, source-linked notebook across projects, with WorkIQ evidence, protected manual additions, and all host-provided tools. |
| [team-lib](plugins/team-lib/README.md) | A shared engineering knowledge book that starts empty, grows its own organization, and helps new hires; Git syncing stays manual. |

## Repository layout

```text
.claude-plugin\marketplace.json
plugins\daily-work-notebook\
  .claude-plugin\plugin.json
  agents\work-recorder.agent.md
  README.md
plugins\team-lib\
  .claude-plugin\plugin.json
  agents\team-lib.agent.md
  README.md
LICENSE
README.md
```

The [marketplace manifest](.claude-plugin/marketplace.json) retains the legacy
marketplace layout. Each `./plugins/<plugin-name>` source is relative to this
repository root; each nested plugin manifest resolves `./agents` from its
package root. Folder compatibility alone does not establish Claude runtime or
tool compatibility.

## Install or develop locally

If the intended repository `tonystevenj/hojiwa-agents` is available to you:

```powershell
copilot plugin marketplace add tonystevenj/hojiwa-agents
copilot plugin install daily-work-notebook@hojiwa-agents
copilot plugin install team-lib@hojiwa-agents
```

These are installation instructions, not a claim that the repository has been
published or verified publicly accessible. Run them only when you intend to
change your own registration/installation.

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

## License

[MIT](LICENSE), copyright (c) 2026 Steven J.
