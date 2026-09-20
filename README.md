# hojiwa-agents

A portable GitHub Copilot CLI plugin marketplace maintained by
[tonystevenj](https://github.com/tonystevenj) (Steven J). Packages contain agent
instructions and documentation, not personal notebooks, credentials, or work data.

## Catalog

| Plugin | Purpose |
| --- | --- |
| [daily-work-notebook](plugins/daily-work-notebook/README.md) | One personal, source-linked notebook across projects, with read-only WorkIQ retrieval and protected manual additions. |

## Repository layout

```text
.claude-plugin\marketplace.json
plugins\daily-work-notebook\
  .claude-plugin\plugin.json
  agents\work-recorder.agent.md
  README.md
LICENSE
README.md
```

The [marketplace manifest](.claude-plugin/marketplace.json) retains the legacy
marketplace layout. Its `./plugins/daily-work-notebook` source is relative to
this repository root; the [nested plugin manifest](plugins/daily-work-notebook/.claude-plugin/plugin.json)
resolves `./agents` from the package root. Folder compatibility alone does not
establish Claude runtime or tool compatibility.

## Install or develop locally

If the intended repository `tonystevenj/hojiwa-agents` is available to you:

```powershell
copilot plugin marketplace add tonystevenj/hojiwa-agents
copilot plugin install daily-work-notebook@hojiwa-agents
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

On every invocation the agent reads the personal convention
`<actual-user-home>\.copilot\work-recorder.json`, with user-approved
`notebookPath` and `timeZone` settings shared across projects. This is read by
the agent's instructions, not native Copilot settings or an installer form.
There is no default notebook location, bundled scheduler, or packaged work data.
Keep personal config and notebook content outside this repository.

## License

[MIT](LICENSE), copyright (c) 2026 Steven J.
