# Provenance and Version of llms.txt

Hextra's official documentation site generates `llms.txt` as an index. This repository keeps a byte-for-byte copy.

| Field | Value |
| :-- | :-- |
| Source URL | https://imfing.github.io/hextra/llms.txt |
| Downloaded | 2026-11-21 at 04:26 UTC |
| Generated | 2026-11-17 at 17:26:40 UTC, as recorded on the last line |
| HTTP Last-Modified | Tue, 17 Nov 2026 17:27:22 GMT |
| HTTP ETag | `"6afc8e7a-16d0"` |
| File size | 5,840 bytes |
| SHA-256 | `378047feb84acafbfa4dae439d6d0b4ebe53c7e3d369e368e4766f8266dbfc34` |
| Inferred source commit | `9e14531e5731f403ba17aac1f260b74c8441d4fb` on imfing/hextra `main` at 2026-11-17T17:26:17Z, "docs(shortcodes): clarify hero-button style and link behavior (#1055)" |
| Hextra version pinned in this repository | v0.13.0 in `go.mod`, tag commit `adf732f8d97cb8e149d4aba232a449d41cd9e38c` |

## Basis for the Source Commit

The site generated the index at 17:26:40 UTC, 23 seconds after the latest `main` commit at 17:26:17 UTC. That timing is the basis for the inferred commit. The site did not report the commit itself.

## Documentation and Module Versions

The documentation tracks `main` and may include features added after v0.13.0. Verify documented features against the pinned module source before using them.

## Refresh the Archive

```bash
curl -sS -D /tmp/llms.headers -o /tmp/llms.txt https://imfing.github.io/hextra/llms.txt
tail -3 /tmp/llms.txt
shasum -a 256 /tmp/llms.txt
curl -sS "https://api.github.com/repos/imfing/hextra/commits?sha=main&per_page=1"
```

Replace the archived `llms.txt` with the downloaded file and update the table. When upgrading Hextra, update the version in the table and the [skill](../SKILL.md), and log verified findings under the matching release.
