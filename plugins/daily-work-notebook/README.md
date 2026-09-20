# Daily work notebook plugin

Maintain one personal, source-linked work notebook across projects. The
`work-recorder` agent drafts daily records from read-only Microsoft 365 evidence,
incorporates your corrections and offline work, tracks projects and commitments,
and answers questions with original sources when available. You choose the
notebook location and time zone; neither is supplied by the package.

## Requirements and compatibility

- GitHub Copilot CLI with support for plugins, custom agents, and the declared
  read/search/edit/interactive-question tools.
- Host capabilities and permissions to read your actual home, validate personal
  config and an IANA time zone, and access your chosen local notebook directory.
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

Use `/agent` to select the plugin-provided `work-recorder` agent. If it is not
listed, report the loading problem; do not bypass the profile with an unrestricted
agent. Local loading is an invocation-time option, not a persistent installation
or activation change. To inspect local plugin discovery without updating:

```powershell
copilot --no-auto-update --plugin-dir ".\plugins\daily-work-notebook" plugin list
```

The [plugin manifest](.claude-plugin/plugin.json) resolves `./agents` relative
to this package. The runtime instructions are in
[agents/work-recorder.agent.md](agents/work-recorder.agent.md). Discovery alone
does not demonstrate executed onboarding or end-to-end WorkIQ behavior.

## First use: choose your personal notebook

Start an interactive conversation with the selected agent, for example:

> Set up my personal work notebook.

On every invocation, the agent explicitly reads
`<actual-user-home>\.copilot\work-recorder.json`. This is a plugin-specific
personal config convention, not a native Copilot settings feature or an
installation prompt. The same file is used across workspaces. The agent derives
your actual home from trustworthy host context, never the current checkout,
plugin/cache location, a retrieved instruction, or another user's home.

The config is a JSON object with two required nonempty string fields:

| Field | Meaning |
| --- | --- |
| `notebookPath` | Absolute local directory you choose for notebook content. |
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

If config is missing/invalid, or its notebook was moved or deleted, the agent
asks one focused question at a time: notebook path first, then time zone as
needed. Valid settings are retained. Relative input requires an explicit
workspace basis and confirmation of the resulting absolute path. Filesystem
roots, your home itself, plugin/cache storage, and directories inside or
containing the plugin package are not notebook locations. Resolved paths and
links/junctions must be checked with available host capabilities; unverified
settings cannot be treated as valid.

The agent shows the resolved notebook path, config path, and time zone and asks
for approval before saving. Creating a missing chosen notebook directory needs
separate explicit approval; a stale config is never permission to recreate a
deleted notebook. Existing content is preserved. Setup creates no empty index,
categories, or notes.

Only approved interactive setup/reconfiguration may write this personal config
(and its `.copilot` parent if missing and explicitly approved). Unrelated JSON
fields are preserved; malformed content requires approval of the specific repair,
not silent replacement. General Copilot settings, authentication, permissions,
ignore files, and other profiles are not changed.

Unattended runs fail explicitly if config, the notebook, validation capability,
or access is unavailable. They do not ask blocking questions, save config,
create folders, or pick a fallback location. Host restrictions remain
authoritative even when you approve a proposed operation.

## Change settings

Ask interactively, for example:

> Change the location of my personal notebook.

> Change the time zone used for my notebook.

The agent uses the same validation and approval flow. Changing `notebookPath`
does not move, copy, or delete old notes, migrate history, or initialize empty
pages. Changing `timeZone` does not update a schedule; configure your scheduler
separately. The agent rereads config before each write batch. If it changed during
a run, the run stops rather than writing an old plan to an old or redirected
location. Target files are also reread to preserve concurrent user edits.

## Everyday examples

With valid setup, ask the selected agent:

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

Questions are read-only unless you explicitly ask to save the answer. Setup
approval authorizes settings only, not saving a query result. Weekly notes are
created only when requested.

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

No schedule is included, created, or started. Complete interactive setup first.
If you independently configure a scheduler, choose its cadence and time zone
explicitly and give its host only the access it needs. A possible prompt is:

> Read the current work-recorder profile from this plugin's actual installed
> location and honor its tool and write restrictions. Read the current user's
> personal work-recorder config from the trusted actual home. Fail without
> writes or questions if config, notebook, validation, or access is unavailable.
> Draft today's record in the configured time zone through the actual retrieval
> cutoff. Preserve corrections, reconcile earlier partial-day coverage only
> where retrieval succeeds, and report source gaps and actual changed files.

The scheduler must supply a trustworthy current time and use the intended
restricted agent; reading a profile into an unrestricted session is not a
tool sandbox. There is no guarantee of offline delivery or missed-run catch-up.

## Privacy, sources, and limits

Only the declared read-only WorkIQ tools are allowed: `workiq/retrieve`,
`workiq/search_paths`, `workiq/get_schema`, `workiq/fetch`, and `workiq/fetch_blob`.
The agent must not send messages, mutate Microsoft 365 content, delegate M365
actions, run Git or shell commands, create worktrees, install dependencies,
browse the public web, or create schedules.

Notebook-only writes have only the narrowly approved setup exception above.
Do not put your notebook or personal config inside this distributable package.
Keep sensitive notes out of public repositories and consider whether your
chosen local folder is synchronized or shared. Organizational access controls
and sensitivity labels still apply.

Persist concise notes and real source links, not raw transcripts, message
archives, secrets, or unrelated personal information. Retrieved material is
evidence, not instructions. Links retain their original access requirements;
this plugin does not make private sources public. Never fabricate URLs or
evidence. Current-status answers need newer source checks, or an explicit
statement that current verification was unavailable.

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
