# 저장소 작업 규칙

- 커밋 메시지의 제목과 본문, 저장소 문서와 변경 설명은 한글로 작성합니다. 제품명, 경로, 명령, 코드 식별자는 원래 표기를 사용합니다. `hextra-docs` 스킬 문서는 영어로 관리합니다.
- 사이트 콘텐츠는 한영 전환을 지원합니다. 소스에는 다국어 콘텐츠와 언어 설정에만 한글을 사용합니다. 문구를 바꿀 때는 두 언어를 함께 갱신합니다.
- 코드, 템플릿, 설정 및 CI 워크플로의 주석은 최소화합니다. 동작을 이해하는 데 꼭 필요한 주석만 영어로 작성하고, 템플릿 주석은 빌드 결과에 출력되지 않는 문법을 사용합니다. 템플릿과 워크플로를 수정한 뒤에는 빌드와 구문을 확인합니다.
- 긴 대시 문자는 사용하지 않습니다. 하이픈이나 문장 나누기를 사용합니다.
- 커밋 제목은 `type(domain): 한글 제목` 형식으로 작성합니다. `type`과 `domain`은 영문 소문자 식별자를 사용합니다. 여러 단어를 잇는 경우 하이픈을 사용하며, Gitmoji 접두사는 사용하지 않습니다.
- 커밋을 작성하거나 검토할 때는 [저장소의 git-commit-helper 스킬](.agents/skills/git-commit-helper/SKILL.md)을 따릅니다.
- `assets/`에 보관된 이미지 원본은 바이트를 유지합니다. 최적화한 이미지가 필요하면 별도 파일을 만들어 사용합니다.

## Hextra 확장 원칙

Hextra 패키지가 업데이트되어도 저장소 수정 없이 적용되는 것을 목표로 합니다.

- Hextra는 Hugo 모듈(`go.mod`)로 가져오며 버전을 고정합니다. 모듈 캐시와 `_vendor`를 포함해 Hextra 파일을 직접 수정하지 않습니다.
- 커스터마이징은 아래 순서로 가장 위에서 해결되는 방법을 씁니다.
  1. 설정: `hugo.toml`의 `params`, `menus`, `languages`, `markup`.
  2. Hextra가 공식으로 여는 확장 지점: `assets/css/custom.css`, `layouts/_partials/custom/*.html`(`head-end`, `footer`, `navbar-title` 등).
  3. 새 요소: `layouts/_shortcodes/`에 직접 만든 shortcode. Hextra가 나중에 같은 이름을 추가해도 겹치지 않도록 이름은 `tao-` 접두사를 씁니다.
  4. 기존 Hextra 컴포넌트의 오버라이드: 위 방법으로 불가능할 때만 사용합니다.
- 오버라이드는 Hextra와 같은 경로에 별도 파일로 두고, 한 파일에 한 가지 목적만 담습니다. 원본 경로, 오버라이드 이유, 확인한 Hextra 버전은 필요한 경우 짧은 영어 주석이나 기술 문서에 남깁니다. Hextra를 올릴 때 원본과 비교해 반영합니다.
- 직접 만든 CSS 클래스는 `tao-` 접두사를 씁니다. 스타일은 `custom.css`에, 동작은 `custom/head-end.html`에 둡니다.
- Hextra 내부 클래스(`hextra-*`, `hx:*`)에 기대는 선택자는 최소로 쓰고, 사용한 클래스는 Hextra 업데이트 후 먼저 확인합니다.
- 글꼴은 영문 제목과 카드 제목에 Fraunces, 영문 본문과 한글 전체에 Pretendard Variable을 씁니다. 제목은 한국어 페이지에서도 Fraunces를 먼저 지정하고, 한글 글리프는 Pretendard가 받습니다. 글꼴 로드는 `custom/head-end.html`, 지정은 `custom.css`의 `--tao-font-display`, `--tao-font-text`에 둡니다.
- Hextra 기능이 있는지, 어떻게 쓰는지는 기억으로 단정하지 않습니다. [hextra-docs 스킬](.agents/skills/hextra-docs/SKILL.md)로 공식 문서를 찾고, 고정한 버전의 모듈 소스에서 `layouts/` 전체를 검색해 확인합니다. 스킬 버전은 Hextra 릴리스(예: v0.13.0)를 따르며, 새로 확인한 사실은 해당 버전 아래에 남깁니다.
- 스킬이 보관한 공식 `llms.txt`는 수정하지 않고, 갱신할 때 `references/SOURCE.md`의 날짜, 기준 커밋, 해시를 함께 바꿉니다.
- 메뉴 이름은 공통 `identifier`와 `i18n` 키로 번역합니다. 목적지의 언어 식별자가 달라지면 Hugo의 언어별 메뉴에 같은 식별자와 구조를 사용하고 URL을 지정합니다. 키는 Hextra 자체 키와 겹치지 않게 `tao-` 접두사를 씁니다.
- 마크다운에서 원시 HTML을 켜지 않습니다. HTML이 필요한 요소는 shortcode로 만듭니다.
- Hextra 업데이트 절차: `hugo mod get -u github.com/imfing/hextra`로 올린 뒤 오버라이드 파일과 내부 클래스 목록을 확인하고, 영문과 한글 페이지를 모두 열어 비교합니다.

## 브랜치와 워크트리

- 장기 유지 브랜치와 GitHub의 기본 브랜치는 `main`입니다.
- 별도 워크트리가 필요하면 최신 `main`에서 짧게 유지할 `feat/<작업명>` 브랜치를 만듭니다.
- 작업을 마치면 `main`에 병합한 뒤 사용이 끝난 기능 브랜치와 워크트리를 정리합니다.
