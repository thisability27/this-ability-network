---
"this-ability-network": patch
---

WCAG 2.2 A·AA 성공 기준별 처리 방식을 `docs/wcag-coverage.json`에 정리하고 axe-core가 잡지 못하는 항목을 검사하는 자체 규칙과 `npm run test:wcag`를 추가합니다. 검사 중 발견한 보이지 않는 제목 링크 포커스와 이벤트 섹션의 포커스 링 대비를 고칩니다.
