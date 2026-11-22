# 접근성 검증

## 자동 검사

저장소 루트에서 Hugo, Go, Node.js, Python 3를 사용할 수 있는 상태로 실행합니다.

```sh
npm ci
npx playwright install chromium
npm run test:accessibility
```

검사는 8776 포트에서 Hugo 빌드 결과를 제공하고, 한·영 홈·행사 목록·상세 페이지를 검사합니다. 모바일 320px와 어두운 테마의 홈·행사 목록도 확인합니다. `main` 대상 PR에서 같은 검사를 실행합니다.

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
