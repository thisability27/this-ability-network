# 접근성 검증

## 자동 검사

저장소 루트에서 Hugo, Go, Node.js, Python 3를 사용할 수 있는 상태로 실행합니다.

```sh
npm ci
npx playwright install chromium
npm run test:accessibility
```

검사는 8776 포트에서 Hugo 빌드 결과를 제공하고, 한·영 홈·행사 목록·상세 페이지를 검사합니다. 모바일 320px와 어두운 테마의 홈·행사 목록도 확인합니다. `main` 대상 PR에서 같은 검사를 실행합니다.

## WCAG 2.2 규칙 기반 검증

기준은 W3C 권고안 WCAG 2.2(2024-12-12)의 A와 AA 성공 기준입니다(4.1.1은 삭제되어 제외). WCAG 3.0은 초안이라 쓰지 않습니다.

```sh
npm run test:wcag
```

`npm run test:accessibility`와 PR의 접근성 CI도 같은 테스트를 포함해 실행합니다.

- `docs/wcag-coverage.json`은 55개 기준 각각의 처리 방식을 기록합니다. axe-core 규칙, 자체 규칙(`script`), 수동 점검(`manual`), 해당 없음(`na`) 중 하나 이상이 있어야 합니다.
- `scripts/wcag-rules.mjs`는 axe-core가 잡지 못하는 항목을 Playwright로 검사합니다. 포커스 링 대비(1.4.11, 2.4.7), 고정 내용에 가려진 포커스(2.4.11), 메뉴가 열린 상태의 터치 대상 크기(2.5.8), 320px 리플로(1.4.10), 글자 간격 조정 시 잘림(1.4.12)을 확인하고, 위반하면 기준 번호, selector, 측정값을 출력합니다.
- 입력 컨트롤, 드래그 요소, 영상과 음성이 생기면 `no-form-controls`, `no-drag-interaction`, `no-media`가 실패합니다. 3.3.7, 3.3.8, 2.5.7 등의 해당 없음 판단을 다시 해야 한다는 신호입니다.
- `tests/wcag-coverage.spec.mjs`는 매핑의 axe 규칙 id와 script id가 실제로 존재하는지, A와 AA 기준이 빠지지 않았는지, 설치된 axe-core에 매핑되지 않은 규칙이 없는지 확인합니다. axe-core를 올리면 이 테스트가 변경을 알려 줍니다.
- `.agents/skills/wcag22-check`가 이 순서를 안내합니다. AccessLint 스킬은 표본 점검과 탐색에, 이 검증은 기준별 회귀 확인에 씁니다.

### 한계

자동 검사는 WCAG 준수를 보증하지 않습니다. 매핑에서 `manual`로 남은 기준(대체 텍스트의 적절성, 읽기 순서, 키보드 트랩, 호버 콘텐츠 등)과 스크린리더 낭독은 아래 수동 검사로 사람이 확인해야 합니다. 자체 규칙은 대표 페이지와 UI 상태(모바일 메뉴, 드롭다운)만 다룹니다.

## 수동 검사

- Safari와 VoiceOver로 두 언어의 홈과 행사 상세에서 랜드마크, 제목, 이미지, 포스터 본문을 차례로 탐색합니다. 로고 링크가 단체명으로 읽히는지, 사진 확대 창의 제목과 버튼이 현재 언어로 읽히는지 확인합니다.
- Chrome 읽기 모드에서 네트워크 소개와 행사 주소를 찾고, 소리 내어 읽기로 한·영 본문과 제목의 읽기 순서를 확인합니다.
- 모바일 폭에서 닫힌 메뉴를 Tab으로 건너뛰는지 확인합니다. 메뉴와 확대 창을 Enter로 열고 Escape로 닫은 뒤 포커스가 원래 버튼 또는 사진으로 돌아오는지 확인합니다.
- 결과에는 브라우저와 낭독 도구, 언어, 확인한 경로, 실제 낭독 여부를 기록합니다. Mozilla Readability 검사는 본문 추출을 확인합니다.

## AccessLint 스킬

검토한 [AccessLint 소스 리비전](https://github.com/AccessLint/skills/tree/2e9d7336678302d0bc08848e92542560295b34d3)에서 세 스킬과 공통 방법론을 프로젝트의 `.agents/skills/`에 설치합니다. 이 체크아웃에서 다음 명령을 실행합니다.

```sh
source_dir=$(mktemp -d)
git clone https://github.com/AccessLint/skills "$source_dir"
git -C "$source_dir" checkout --detach 2e9d7336678302d0bc08848e92542560295b34d3
for skill in accessibility-audit accessibility-scan accessibility-inspect shared; do
  test ! -e ".agents/skills/$skill" || continue
  cp -R "$source_dir/plugins/accesslint/skills/$skill" .agents/skills/
done
```

정기 점검에는 `accessibility-audit`의 표본 선정 절차를, 특정 페이지의 키보드·포커스 점검에는 `accessibility-inspect`를 사용합니다. `accessibility-scan`은 AccessLint CLI로 별도 진단을 실행할 때 사용합니다.
