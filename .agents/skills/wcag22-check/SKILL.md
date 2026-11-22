---
name: wcag22-check
description: 이 저장소의 WCAG 2.2 A·AA 검증을 실행하고 결과를 해석합니다. 접근성 변경을 검토하거나 axe-core를 올릴 때 사용합니다.
---

# WCAG 2.2 검증

기준은 W3C 권고안 WCAG 2.2(2024-12-12)의 A와 AA입니다. WCAG 3.0은 초안이므로 쓰지 않습니다. 4.1.1은 2.2에서 삭제되어 제외합니다.

## 순서

1. `docs/wcag-coverage.json`에서 변경과 관련된 성공 기준의 처리 방식을 확인합니다. `axe`는 axe-core 규칙 id, `script`는 `scripts/wcag-rules.mjs`의 규칙 id, `manual`은 사람이 확인할 항목, `na`는 해당 없음 근거입니다.
2. `npm run test:wcag`로 자체 규칙과 매핑 일관성을 검사합니다. 위반은 `[규칙 id] WCAG 번호`, `selector`, `measured` 순서로 출력됩니다.
3. `npm run test:accessibility`로 axe 검사와 키보드 테스트를 포함한 전체를 실행합니다. Hugo가 PhotoSwipe를 내려받으므로 네트워크가 필요하고, `TAO_CHROME_PATH`로 Chromium 경로를 지정할 수 있습니다.
4. `manual` 항목은 `docs/accessibility.md`의 수동 점검 절차로 확인하고 결과를 기록합니다.

## 규칙을 바꿀 때

- 새 규칙은 `scripts/wcag-rules.mjs`에 `id`, `criteria`, `run`을 갖추어 추가하고 매핑 파일의 해당 기준 `script`에도 같은 id를 적습니다. 두 곳이 어긋나면 `tests/wcag-coverage.spec.mjs`가 실패합니다.
- 해당 없음(`na`)은 반드시 `script` 단언을 함께 둡니다. 입력 컨트롤, 드래그, 미디어가 생기면 단언이 실패하므로 그때 해당 없음 판단을 다시 합니다.
- axe-core를 올리면 매핑 일관성 테스트가 실패합니다. 새 규칙을 매핑에 반영하고 `axeCore` 버전을 갱신합니다.

## AccessLint 스킬과의 역할

`accessibility-audit`, `accessibility-inspect`, `accessibility-scan`(설치 방법은 `docs/accessibility.md`)은 표본 선정과 페이지별 탐색적 점검에 씁니다. 이 스킬은 기준 번호별 회귀 검증과 커버리지 관리에 씁니다. 자동 검사는 WCAG 준수를 보증하지 않으므로 스크린리더 확인은 둘 다 사람이 합니다.
