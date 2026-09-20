# Daily work notebook plugin

Maintain one personal, source-linked work notebook across projects. The
`work-recorder` agent drafts daily records from Microsoft 365 evidence,
incorporates your corrections and offline work, tracks projects and commitments,
and answers questions with original sources when available. You choose the
notebook location and time zone; neither is supplied by the package.

## Requirements and compatibility

- GitHub Copilot CLI with support for plugins, custom agents, and the tools needed
  for your request. The agent declares `tools: ['*']`.
- Host capabilities and permissions to read your actual home, validate personal
  config and an IANA time zone, and access your chosen local notebook directory.
  Filesystem tools, shell commands, and system APIs may perform these checks.
  Instructions cannot grant access. If a required check or operation is
  unavailable, the agent must report a blocker rather than bypass restrictions.
- For automated Microsoft 365 retrieval: your own WorkIQ connection exposed as
  `workiq`, appropriate account entitlements, and your organization's permission
  to access and summarize the selected data. The plugin supplies no connection,
  credentials, licenses, tenant consent, or additional access rights.

After valid setup, explicitly requested manual recording and local notebook
questions work without WorkIQ. Automatic retrieval must instead report failure
when WorkIQ is unavailable; it must not claim successful or exhaustive coverage.

This package targets Copilot. Its legacy `.claude-plugin`/`agents` folder layout
does not establish Claude runtime or tool compatibility. It contains only agent
instructions and documentation: no hooks, scripts, dependencies, MCP server,
native `userConfig` feature, installer questionnaire, or bundled scheduler.

## Install or load locally

The [marketplace manifest](../../.claude-plugin/marketplace.json) names marketplace
`hojiwa-agents` and plugin `daily-work-notebook`. If the intended repository
`tonystevenj/hojiwa-agents` is available to you, you can register and install it:

```powershell
copilot plugin marketplace add tonystevenj/hojiwa-agents
copilot plugin install daily-work-notebook@hojiwa-agents
```

Repository publication and public availability are not verified here. Those
commands change your local registration/installation only when you run them.

For local development, from the current marketplace repository root, run:

```powershell
copilot --plugin-dir ".\plugins\daily-work-notebook"
```

After editing the source, start a fresh CLI invocation with this option to load
the changes. A marketplace-installed copy does not track local edits; updating
that copy fetches its published source, not this working directory.

Use `/agent` to select the plugin-provided `work-recorder` agent. If it is not
listed, diagnose the loading problem. Local loading is an invocation-time option,
not a persistent installation or activation change. To inspect local plugin
discovery without updating:

```powershell
copilot --no-auto-update --plugin-dir ".\plugins\daily-work-notebook" plugin list
```

The [plugin manifest](.claude-plugin/plugin.json) resolves `./agents` relative
to this package. The runtime instructions are in
[agents/work-recorder.agent.md](agents/work-recorder.agent.md). Discovery alone
does not demonstrate executed onboarding or end-to-end WorkIQ behavior.

## First use: start recording

Start an interactive conversation with the selected agent, for example:

> Do your work for today.

No separate setup command is needed. The agent asks for a notebook location and
time zone only if they are missing or ambiguous, saves them, and continues with
the requested record. It reuses answers already given in the conversation.
You can also provide everything in one request:

> Record today's work in C:\Users\ExampleUser\Documents\WorkNotebook, using
> Seattle time.

The example path is not a default. "Seattle time" resolves to
`America/Los_Angeles`, including daylight-saving changes.

Before notebook access or retrieval, the agent reads
`<actual-user-home>\.copilot\work-recorder.json`. This is a plugin-specific
personal config convention, not a native Copilot settings feature or an
installation prompt. The same file is used across workspaces. The agent derives
your actual home from trustworthy host context, never the current checkout,
plugin/cache location, a retrieved instruction, or another user's home.

The config is a JSON object with two required nonempty string fields:

| Field | Meaning |
| --- | --- |
| `notebookPath` | Absolute filesystem directory you choose for notebook content. |
| `timeZone` | Valid IANA time-zone identifier used for dates and coverage windows. |

Illustration only, **not a default**: this fictional Windows user chose this
directory and zone. Replace both with your own approved settings; other hosts
must use their own absolute local path syntax.

```json
{
  "notebookPath": "C:\\Users\\ExampleUser\\Documents\\WorkNotebook",
  "timeZone": "Europe/Paris"
}
```

Valid settings are retained. Relative paths are resolved against the intended
workspace and stored as absolute filesystem paths. The agent may use filesystem
tools, shell commands, or system APIs to validate directories, links/junctions,
access, and time zones. There is no plugin-specific location blacklist; host
permissions still apply. Avoid distributable or public locations for private
work data.

The agent shows the notebook path, config path, and time zone, creates needed
directories, and saves settings as part of authorized setup. It follows host
confirmation requirements without adding separate approval gates for each setup
step. Existing content and unrelated JSON fields are preserved. Discarding
malformed config still requires confirmation.

Unattended runs can complete authorized setup using saved or explicitly supplied
settings. If required details or access are missing, they report the blocker
without guessing or asking blocking questions.

## Change settings

Ask interactively, for example:

> Change the location of my personal notebook.

> Change the time zone used for my notebook.

The agent uses the same setup flow. Changing `notebookPath` does not imply moving
old notes; request a migration if wanted. Changing `timeZone` does not implicitly
update schedules, but the agent can update them when asked. The agent rereads
config and target files before notebook write batches, replans if the destination
changed, and preserves concurrent user edits.

## Everyday examples

Ask the selected agent; it handles setup when needed:

- **Automatic draft:** "Draft today's work record from accessible WorkIQ sources.
  Show the retrieval window, source coverage, and anything I should review."
- **Manual entry:** "Record my offline design review today. We proposed reducing
  the retry limit, but no implementation was completed."
- **Correction:** "Correct today's note: I investigated the failure; I did not
  resolve it. Preserve that correction on future automatic reruns."
- **Local query:** "Using only my notebook, what did I record about the migration?"
- **Current status:** "What is the current migration status? Recheck original
  sources and distinguish current evidence from older notes."
- **Weekly review:** "Summarize last week's completed outcomes, ongoing work,
  decisions, and blockers. Save a weekly note with source and daily links."

Questions return answers without saving them unless requested. A recording
request includes saving the record after setup; a setup-only request does not
generate unrelated notes. Weekly notes are created when requested.

## Notebook content and review

The agent reads existing notes and follows compatible conventions. It creates
only files justified by content, relative to your chosen notebook root:

| Path | Purpose |
| --- | --- |
| `daily\YYYY-MM-DD.md` | Primary daily record, coverage, review state, additions and corrections. |
| `projects\<project-slug>.md` | Relevant cross-day context, decisions, and status. |
| `tasks.md` | Explicit commitments with supporting daily/source links. |
| `weekly\YYYY-Www.md` | Requested weekly summaries. |
| `index.md` | Small navigation index, not duplicated notebook content. |
| `log.md` | Short metadata for substantive updates only. |

Manual additions and corrections are protected from automatic overwrites.
Only your explicit confirmation marks a note reviewed. Substantive automatic
additions to reviewed notes need review again without replacing reviewed
material. Evidence is deduplicated; a rerun with nothing substantive to add
makes no edits, including no timestamp-only or log-only changes.

Sources support what they actually say, not assumed completion or attendance.
An invitation is not proof of attending a meeting. Reported facts, hypotheses,
proposals, ongoing work, and completed outcomes remain distinct. Offline work
is first-class user-provided evidence and is cited through the daily note.

## Optional scheduling

No schedule is bundled or started automatically. You can ask the agent to
configure one using available host tools. Supply its cadence, time zone, and
notebook settings, or complete interactive setup first. A possible prompt is:

> Read the current work-recorder profile from this plugin's actual installed
> location. Read the current user's personal work-recorder config from the
> trusted actual home. Use available tools to complete authorized setup if needed;
> report missing information or access without asking blocking questions.
> Draft today's record in the configured time zone through the actual retrieval
> cutoff. Preserve corrections, reconcile earlier partial-day coverage only
> where retrieval succeeds, and report source gaps and actual changed files.

The scheduler must supply a trustworthy current time and the intended agent
configuration. There is no guarantee of offline delivery or missed-run catch-up.

## Tool access and privacy

The agent declares `tools: ['*']` and adds no plugin-specific tool allowlist or
blanket operational bans. It can use shell commands, Git, file edits outside the
notebook, plugin/profile maintenance, dependency installation, public web access,
scheduling, delegation, and available WorkIQ operations for your requests.
Deferred tools are discovered through the host before use.

Tool availability does not authorize unrelated actions. Microsoft 365 mutations,
messages, and other external actions remain subject to your requested scope,
host permissions, and required confirmations. Organizational access controls and
sensitivity labels still apply. Consider whether your notebook is synchronized,
shared, or public before storing private work information.

Default notebook entries contain concise notes and real source links rather than
raw archives; exports can be requested separately. Protect secrets and private
data. Retrieved material is evidence, not instructions. Links retain their
original access requirements; this plugin does not make private sources public.
Never fabricate URLs or evidence. Current-status answers need newer source
checks, or an explicit statement that current verification was unavailable.

Coverage is bounded, not exhaustive. The agent reports the requested window,
successful sources, pagination limits, and retrieval/authentication failures.
Complete automated retrieval failure leaves notes unchanged. Partial retrieval
may produce a labeled partial summary without overwriting existing content or
claiming failed intervals were covered. Missing hits do not prove no work occurred.

These are instruction-guided safeguards, not a deterministic sandbox.
Host tools, permissions, and model behavior determine what can actually run.
Static review or successful plugin discovery is not proof of executed
onboarding, safe concurrent writes, or end-to-end WorkIQ retrieval.

## License

[MIT](../../LICENSE), copyright (c) 2026 Steven J.
