# Project workflow

- Canonical remote: https://github.com/akshn18/Electronics-Shop-with-Shopping-Assistant.git
- Work on `main`, tracking `origin/main`, unless the user requests a different branch.
- The user authorizes committing and pushing each completed requested change to `origin/main` after relevant checks pass. This is part of each coding task, not a scheduled job or a filesystem watcher.
- Inspect status and fetch before editing. Fast-forward only when the working tree is clean. Preserve unrelated user changes. Stop and report conflicts, failed checks, authentication failures, or branch protection restrictions; never force-push or discard work.
- Stage only reviewed task files. Never commit API keys, credentials, environment files, dependencies, build output, or temporary preview helpers.
- Use Replit for previews and live assistant testing. Do not start a local preview or require a local API key or database unless the user explicitly asks.
- Run checks appropriate to the change. Report the commit, push result, checks, and anything requiring Replit verification. Do not claim Replit has updated until verified there.
- After a successful push, tell the user to click Sync changes in Replit and restart the app if needed.
- Read `.agents/memory/MEMORY.md` and its referenced project decisions before changing relevant functionality.
