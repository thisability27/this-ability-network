# llms.txt 출처와 버전 기록

`llms.txt`는 Hextra 공식 문서 사이트가 만들어 주는 문서 목차입니다. 원본을 수정하지 않고 그대로 보관합니다.

| 항목 | 값 |
| :-- | :-- |
| 원본 주소 | https://imfing.github.io/hextra/llms.txt |
| 내려받은 날 | 2026-11-21 (UTC 04:26) |
| 문서 생성 시각 | 2026-11-17 17:26:40 UTC (파일 끝줄 기준) |
| HTTP Last-Modified | Tue, 17 Nov 2026 17:27:22 GMT |
| HTTP ETag | `"6afc8e7a-16d0"` |
| 파일 크기 | 5840 바이트 |
| SHA-256 | `378047feb84acafbfa4dae439d6d0b4ebe53c7e3d369e368e4766f8266dbfc34` |
| 문서의 기준 커밋 | `9e14531e5731f403ba17aac1f260b74c8441d4fb` (imfing/hextra `main`, 2026-11-17T17:26:17Z, "docs(shortcodes): clarify hero-button style and link behavior (#1055)") |
| 이 저장소가 고정한 Hextra | v0.13.0 (`go.mod`), 태그 커밋 `adf732f8d97cb8e149d4aba232a449d41cd9e38c` |

## 기준 커밋을 이렇게 정했습니다

문서 생성 시각(17:26:40)이 `main` 최신 커밋 시각(17:26:17)의 23초 뒤입니다. 그래서 이 문서는 위 커밋을 기준으로 만들어졌다고 봅니다. 두 시각의 차이로 추정한 것이며, 사이트가 알려 준 값은 아닙니다.

## 주의: 문서는 main 기준이고 우리는 v0.13.0입니다

문서는 `main`을 따라가므로 v0.13.0 이후에 추가된 기능이 문서에 있을 수 있습니다. 문서에서 기능을 찾았더라도 고정한 버전의 모듈 소스에서 실제로 있는지 확인한 뒤 씁니다.

## 갱신 방법

```bash
curl -sS -D /tmp/llms.headers -o /tmp/llms.txt https://imfing.github.io/hextra/llms.txt
tail -3 /tmp/llms.txt          # 문서 생성 시각
shasum -a 256 /tmp/llms.txt    # 해시
curl -sS "https://api.github.com/repos/imfing/hextra/commits?sha=main&per_page=1"   # 같은 시점의 main 커밋
```

받은 파일을 `llms.txt`에 덮어쓰고 위 표의 값을 모두 새로 적습니다. Hextra 버전을 올렸다면 마지막 행과 [스킬](../SKILL.md)의 버전을 함께 갱신하고, 확인한 사실은 해당 릴리스 아래에 기록합니다.
