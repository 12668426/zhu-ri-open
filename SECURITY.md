# Security & Privacy

ZhuRi is a local-first planner. Personal schedules and tasks are stored in the browser's storage associated with the current site origin.

- No user accounts, external tracking, API keys, third-party scripts, or cloud data collection are part of the base application.
- The app does not promise encryption of local browser storage. Do not place secrets/passwords in plan titles.
- Backups are ordinary unencrypted JSON; store and share them carefully. They should never be added to public issues or pull requests.
- Importing JSON replaces the current local plans after user confirmation. Import input is bounded and rendered with HTML escaping.
- Prefer serving locally on 127.0.0.1 rather than all network interfaces.
- A PWA cache exists for supported HTTPS browsers; offline operation in Plash after shutdown/restart is not yet confirmed.
- Please report vulnerabilities privately to the maintainers rather than publishing exploits or personal data in an issue.
