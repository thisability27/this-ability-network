---
name: hextra-docs
description: Hextra 테마의 공식 문서를 조회할 때 사용합니다. 메뉴, 설정, 커스터마이징, shortcode, 다국어처럼 Hextra 기능이 있는지, 어떻게 쓰는지 확인하거나 단정하기 전에 먼저 보는 문서 지도입니다.
metadata:
  version: "v0.13.0"
---

# Hextra 공식 문서 지도

Hextra 기능이 "있다" 또는 "없다"고 말하기 전에 이 스킬로 문서를 찾고, 고정한 버전의 모듈 소스와 맞춰 봅니다. 기억이나 추측으로 답하지 않습니다.

- 문서 목차 원본: [references/llms.txt](references/llms.txt)
- 출처, 버전, 갱신 방법: [references/SOURCE.md](references/SOURCE.md) (스킬 버전은 `go.mod`에 고정한 Hextra 릴리스를 따릅니다)

## 사용 순서

1. 아래 분류에서 주제에 맞는 페이지를 고릅니다. 이 저장소에서 자주 쓰는 페이지에는 ★ 표시가 있습니다.
2. 페이지를 읽습니다. 주소는 모두 `https://imfing.github.io/hextra/` 아래입니다. 직접 읽을 도구가 없으면 웹 페이지를 읽는 에이전트에게 주소를 줍니다.
3. 고정한 버전의 모듈 소스에서 실제로 있는지 확인합니다. 모듈 위치는 `go list -m -f '{{.Dir}}' github.com/imfing/hextra`로 찾습니다. 비어 있으면 모듈 캐시(`GOMODCACHE`)의 `github.com/imfing/hextra@v0.13.0`를 찾습니다.
4. 문서는 `main` 기준이라 v0.13.0에 없는 기능이 적혀 있을 수 있습니다. 소스에서 확인되지 않으면 "다음 버전의 기능"으로 구분해서 알립니다.
5. 새로 확인한 사실은 이 파일 아래 "확인한 사실"에서 검증한 Hextra 버전 아래에 근거와 함께 추가합니다.

## 소스를 볼 때 주의

한 파일만 보고 결론 내지 않습니다. 예를 들어 `layouts/_partials/navbar.html`에는 드롭다운 처리가 없어서 미지원으로 오판했지만, 실제 처리는 하위 partial `navbar-link.html`에 있었습니다. 기능 유무는 `layouts/` 전체에서 관련 단어(`Children`, `parent` 등)로 검색해 확인합니다.

## 분류

### 시작과 구성
- ★ [Configuration](https://imfing.github.io/hextra/docs/guide/configuration/): `menu.main`(메뉴 종류와 `parent` 중첩), `params`(navbar, footer, theme, search)
- [Getting Started](https://imfing.github.io/hextra/docs/getting-started/): 시작 템플릿
- [Organize Files](https://imfing.github.io/hextra/docs/guide/organize-files/): 디렉터리 구조
- [Deploy Site](https://imfing.github.io/hextra/docs/guide/deploy-site/): 배포

### 확장과 커스터마이징
- ★ [Customizing Hextra](https://imfing.github.io/hextra/docs/advanced/customization/): `custom.css`, `custom/` partial 목록, navbar 너비, 오버라이드 가능한 CSS 클래스
- [Additional Pages](https://imfing.github.io/hextra/docs/advanced/additional-pages/): 용어집, 아카이브 페이지
- [Comments System](https://imfing.github.io/hextra/docs/advanced/comments/): giscus

### 다국어
- ★ [Multi-language](https://imfing.github.io/hextra/docs/advanced/multi-language/): Hugo 다국어 모드와 언어 전환

### 홈과 콘텐츠 컴포넌트 (shortcode)
- ★ [Hextra Shortcodes](https://imfing.github.io/hextra/docs/guide/shortcodes/hextra/): `hextra-home` 레이아웃용 `hextra/hero-*`, `hextra/feature-*`
- ★ [Cards](https://imfing.github.io/hextra/docs/guide/shortcodes/cards/): 카드, 이미지 카드, 링크
- ★ [Gallery](https://imfing.github.io/hextra/docs/guide/shortcodes/gallery/): PhotoSwipe 갤러리
- [Callout](https://imfing.github.io/hextra/docs/guide/shortcodes/callout/), [Details](https://imfing.github.io/hextra/docs/guide/shortcodes/details/), [Steps](https://imfing.github.io/hextra/docs/guide/shortcodes/steps/), [Tabs](https://imfing.github.io/hextra/docs/guide/shortcodes/tabs/), [FileTree](https://imfing.github.io/hextra/docs/guide/shortcodes/filetree/), [Term](https://imfing.github.io/hextra/docs/guide/shortcodes/term/), [Icon](https://imfing.github.io/hextra/docs/guide/shortcodes/icon/)
- [Asciinema](https://imfing.github.io/hextra/docs/guide/shortcodes/asciinema/), [Jupyter Notebook](https://imfing.github.io/hextra/docs/guide/shortcodes/jupyter/), [Other Shortcodes](https://imfing.github.io/hextra/docs/guide/shortcodes/others/) (덜 안정적이라고 명시됨)

### 콘텐츠 작성
- [Markdown](https://imfing.github.io/hextra/docs/guide/markdown/), [Syntax Highlighting](https://imfing.github.io/hextra/docs/guide/syntax-highlighting/), [LaTeX](https://imfing.github.io/hextra/docs/guide/latex/), [Diagrams](https://imfing.github.io/hextra/docs/guide/diagrams/)

### 릴리스 노트 (버전별 새 기능과 변경)
- ★ [v0.13](https://imfing.github.io/hextra/blog/v0.13/) (2026-09-29, 이 저장소 버전), [v0.12](https://imfing.github.io/hextra/blog/v0.12/), [v0.11](https://imfing.github.io/hextra/blog/v0.11/), [v0.10](https://imfing.github.io/hextra/blog/v0.10/)

### 그 외
- [About](https://imfing.github.io/hextra/about/), [Showcase](https://imfing.github.io/hextra/showcase/)

## 확인한 사실

확인한 Hextra 릴리스별로 근거를 추가합니다. 근거의 "문서"는 위 목차의 공식 페이지, "소스"는 해당 버전의 모듈 소스입니다.

### v0.13.0

- **메뉴 드롭다운**: `menu.main`에서 부모에 `identifier`, 자식에 `parent`를 지정하면 한 단계 드롭다운이 됩니다. 문서(Configuration)와 소스(`navbar-link.html`의 `HasChildren`) 모두 확인했습니다. 다단계는 문서에 예시가 없습니다. 모바일에서 자식에 `pageRef`를 쓰면 홈으로 가는 알려진 버그가 있어(imfing/hextra#1027) `url`을 씁니다.
- **드롭다운 적용 결과**: 이 저장소의 "Programs" 메뉴에 적용했습니다(`hugo.toml`). 부모에 `url`이 없어도 되고, 화살표(chevron)는 Hextra가 자동으로 붙이므로 이름에 `▾`를 넣지 않습니다. 데스크톱은 드롭다운, 모바일 햄버거 메뉴는 부모 이름의 그룹 아래에 자식이 나열됩니다. 자식에 `url = '#섹션'`을 쓰면 모바일에서도 올바르게 이동합니다(영문, 한글 모두 확인).
- **이미지 확대(PhotoSwipe)**: gallery shortcode가 있는 페이지에서만 PhotoSwipe(CDN의 5.x, 확인한 버전 5.4.4)가 로드되고, `[data-pswp-gallery]` 컨테이너마다 라이트박스를 만듭니다(소스 `scripts/gallery.html`). 인스턴스와 옵션은 밖으로 열려 있지 않습니다. 썸네일을 CSS로 잘라(`object-fit: cover`) 쓰면 확대 애니메이션이 원본 비율에서 바로 시작하므로, 링크에 `data-cropped="true"`를 붙이면 PhotoSwipe가 cover로 잘린 범위에서 시작합니다. 이때 `data-pswp-width`, `data-pswp-height`는 원본의 실제 크기여야 합니다. 갤러리 밖 이미지도 컨테이너에 `id`와 `data-pswp-gallery`, 링크에 `data-pswp-width`, `data-pswp-height`를 붙이면 같은 확대를 쓸 수 있습니다. PhotoSwipe는 모서리 둥글기(border-radius)를 애니메이션하지 않으므로 둥근 썸네일에서는 시작 순간 모서리가 튑니다. 크롭 애니메이션 동안 보이는 영역은 `.pswp__container`와 슬라이드 홀더(둘 다 `overflow: hidden`)의 교집합이고 썸네일 사각형에서 화면 전체로 같은 이징으로 변합니다. 그래서 `.pswp__scroll-wrap`에 `clip-path: inset(... round ...)`를 같은 시간, 이징으로 애니메이션하면 모서리까지 맞습니다. 열기와 닫기의 시작은 `.pswp__container`의 `transform` `transitionrun` 이벤트로 잡고, 크롭 애니메이션 중에만 컨테이너에 인라인 `overflow: hidden`이 걸리는 것(슬라이드 넘김과 구분)과 루트의 `pswp--ui-visible` 클래스(열 때 켜짐, 닫을 때 꺼짐)로 방향을 구분합니다. 전환 시간과 이징은 컨테이너의 계산된 스타일에서 읽습니다.
- **기본 테마와 "시스템" 옵션**: `params.theme.default`(light, dark, system)로 기본 테마를 바꿉니다. 테마 선택 메뉴의 "시스템" 항목을 끄는 설정은 없고 `theme-toggle.html`에 고정되어 있습니다(소스 확인). 저장된 `color-theme`이 `system`이면 Hextra가 OS 설정을 따르므로, 시스템을 쓰지 않으려면 항목을 숨기는 것에 더해 저장된 값을 `light`나 `dark`로 정리해야 합니다. 이 저장소는 CSS로 항목을 숨기고 `custom/head-end.html`에서 값을 정리합니다.
- **메뉴 이름 번역**: 메뉴 한 벌에 `identifier`를 두고 `i18n/<언어>.yaml`에 같은 키를 두면 언어별로 번역됩니다. 소스는 `or (T .Identifier) .Name`으로 i18n 키를 먼저 찾고 없으면 `name`을 씁니다. 언어별 메뉴를 따로 정의하지 않습니다. Hextra 자체 i18n 키와 겹치지 않게 `tao-` 접두사를 씁니다.
- **i18n 위치**: 설정 키 `i18nDir`로 바꿀 수 있습니다(`hugo config`로 확인).
- **푸터**: 저작권은 `i18n`의 `copyright` 키(마크다운 가능)이고, `displayCopyright`, `displayPoweredBy` 설정은 소스(`footer.html`)에서 확인했으며 설정 문서에는 없습니다. 문서에 없는 설정은 업데이트 때 바뀔 수 있습니다.
- **공식 확장 지점**: `layouts/_partials/custom/`의 `head-end`, `footer`, `page-begin`, `content-begin`, `content-end`, `page-end`, `banner`입니다. `navbar-title`은 문서에 없습니다.
- **문서에 이름이 올라 있는 CSS 클래스**: `hextra-nav-container`, `hextra-nav-container-blur`, `hextra-footer`, `hextra-card`, `hextra-card-image`, `hextra-card-icon`, `hextra-card-subtitle`, `hextra-language-switcher`, `hextra-language-options`, `hextra-theme-toggle`, `hextra-feature-grid`, `hextra-feature-card` 등(Customizing Hextra). 이 이름들은 비교적 안정적이라고 봅니다. 문서에 없는 `hx:*` 유틸리티 클래스와 DOM 구조(`nav > a:first-child` 등)에 기대는 선택자는 위험도가 높습니다.
- **CSS 변수**: `--primary-hue`, `--primary-saturation`, `--primary-lightness`, `--hextra-max-page-width`, `--hextra-max-navbar-width`, `--hextra-max-footer-width`.
- **다국어**: 언어는 `languages.<코드>`의 `label`, `weight`로 정합니다(Hugo v0.158부터 `languageName` 대신 `label`). 루트 주소 리다이렉트는 문서에 없습니다.
- **hextra shortcode**: `hero-button`의 `style` 허용 값과 링크 동작(내부, 외부, target)은 문서에 없고, 소스에서 `http`로 시작하면 새 탭으로 엽니다. 해당 문서 페이지의 최종 수정일은 2025-09-06으로 v0.13 이전입니다.
