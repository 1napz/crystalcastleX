# Unnameable Path Repair

These paths had a filename component longer than the filesystem's
255-byte limit, so they existed only in git's index and defeated
`git checkout` for the entire repository — every workflow failed at
`actions/checkout` before running a single step.

Each was collapsed at its first malformed component. **No file
content was changed** — every blob SHA below is the original.

| Original (first line) | Restored to | Components dropped | Blob |
|---|---|---|---|
| `ReleaseNotesTemplate.md` | `docs/knowledge/ReleaseNotesTemplate.md` | 0 | `bb2898b9e8a5` |
| `howtotos.md` | `docs/knowledge/howtotos.md` | 26 | `7a307f22761e` |
| `📂 ตัวอย่างข้อความแจ้งเตือน bilingual` | `docs/knowledge/📂 ตัวอย่างข้อความแจ้งเตือน bilingual.…` | 0 | `1c3595824793` |
| `🔄 ASCII Diagram: DevContainer Automation + N…` | `docs/knowledge/🔄 ASCII Diagram: DevContainer Automat…` | 2 | `d509d166daa3` |

Every dropped character was verified present in the file body.
