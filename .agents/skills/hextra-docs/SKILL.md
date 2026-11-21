---
name: hextra-docs
description: Look up official Hextra documentation and verify support against the pinned module source for navigation, configuration, customization, shortcodes, and multilingual sites.
metadata:
  version: "v0.13.0"
---

# Hextra Documentation Guide

Check the official documentation and the pinned module source before making claims about Hextra feature support.

- [Archived documentation index](references/llms.txt)
- [Provenance, version, and refresh procedure](references/SOURCE.md). The skill version follows the Hextra release pinned in `go.mod`.

## Workflow

1. Choose the relevant page below. A ★ marks pages frequently used in this repository.
2. Read the relevant page on the [official Hextra site](https://imfing.github.io/hextra/). If direct browsing is unavailable, give the URL to an agent with browsing access.
3. Check the pinned module source. Locate it with `go list -m -f '{{.Dir}}' github.com/imfing/hextra`. If the command returns no directory, look for `github.com/imfing/hextra@v0.13.0` in the module cache (`GOMODCACHE`).
4. The live documentation tracks `main` and may describe features beyond v0.13.0. If a feature is absent from the pinned source, report that it is unavailable in the pinned release.
5. Record new findings and their evidence under the verified release in [Verified Findings](#verified-findings).

Search across `layouts/` before deciding whether a feature is supported. For example, `layouts/_partials/navbar.html` delegates dropdown rendering to `navbar-link.html`. Search for related terms such as `Children` and `parent` to follow the implementation.

## Documentation Index

### Getting Started and Configuration

- ★ [Configuration](https://imfing.github.io/hextra/docs/guide/configuration/) covers `menu.main`, menu nesting with `parent`, and navbar, footer, theme, and search settings.
- [Getting Started](https://imfing.github.io/hextra/docs/getting-started/) covers the starter template.
- [Organize Files](https://imfing.github.io/hextra/docs/guide/organize-files/) covers directory structure.
- [Deploy Site](https://imfing.github.io/hextra/docs/guide/deploy-site/) covers deployment.

### Extensions and Customization

- ★ [Customizing Hextra](https://imfing.github.io/hextra/docs/advanced/customization/) covers `custom.css`, `custom/` partials, navbar width, and CSS classes.
- [Additional Pages](https://imfing.github.io/hextra/docs/advanced/additional-pages/) covers glossary and archive pages.
- [Comments System](https://imfing.github.io/hextra/docs/advanced/comments/) covers giscus.

### Multilingual Sites

- ★ [Multi-language](https://imfing.github.io/hextra/docs/advanced/multi-language/) covers Hugo's multilingual mode and language switching.

### Home and Content Shortcodes

- ★ [Hextra Shortcodes](https://imfing.github.io/hextra/docs/guide/shortcodes/hextra/) covers `hextra/hero-*` and `hextra/feature-*` for the `hextra-home` layout.
- ★ [Cards](https://imfing.github.io/hextra/docs/guide/shortcodes/cards/) covers cards, images, and links.
- ★ [Gallery](https://imfing.github.io/hextra/docs/guide/shortcodes/gallery/) covers PhotoSwipe galleries.
- [Callout](https://imfing.github.io/hextra/docs/guide/shortcodes/callout/), [Details](https://imfing.github.io/hextra/docs/guide/shortcodes/details/), [Steps](https://imfing.github.io/hextra/docs/guide/shortcodes/steps/), [Tabs](https://imfing.github.io/hextra/docs/guide/shortcodes/tabs/), [FileTree](https://imfing.github.io/hextra/docs/guide/shortcodes/filetree/), [Term](https://imfing.github.io/hextra/docs/guide/shortcodes/term/), and [Icon](https://imfing.github.io/hextra/docs/guide/shortcodes/icon/).
- [Asciinema](https://imfing.github.io/hextra/docs/guide/shortcodes/asciinema/), [Jupyter Notebook](https://imfing.github.io/hextra/docs/guide/shortcodes/jupyter/), and [Other Shortcodes](https://imfing.github.io/hextra/docs/guide/shortcodes/others/). The documentation describes the latter group as less stable.

### Writing Content

- [Markdown](https://imfing.github.io/hextra/docs/guide/markdown/), [Syntax Highlighting](https://imfing.github.io/hextra/docs/guide/syntax-highlighting/), [LaTeX](https://imfing.github.io/hextra/docs/guide/latex/), and [Diagrams](https://imfing.github.io/hextra/docs/guide/diagrams/).

### Release Notes

- ★ [v0.13](https://imfing.github.io/hextra/blog/v0.13/) (September 29, 2026, the release series used here), [v0.12](https://imfing.github.io/hextra/blog/v0.12/), [v0.11](https://imfing.github.io/hextra/blog/v0.11/), and [v0.10](https://imfing.github.io/hextra/blog/v0.10/).

### Other Resources

- [About](https://imfing.github.io/hextra/about/) and [Showcase](https://imfing.github.io/hextra/showcase/).

## Verified Findings

Entries refer to the official pages above and to the module source for the listed release.

### v0.13.0

- **Navigation dropdowns.** Set an `identifier` on the parent and a matching `parent` on its children in `menu.main`. The Configuration page and the `HasChildren` branch in `navbar-link.html` confirm one level of nesting. The documentation provides no example of deeper nesting. For fragment links, use `url`. A child `pageRef` can send mobile visitors to the home page (imfing/hextra#1027).
- **Programs menu.** The parent in `hugo.toml` needs no URL. Hextra supplies the chevron and shows a dropdown on desktop. The mobile menu lists its children under the parent label. Child links such as `url = '#concerts'` were verified in English and Korean. The mobile handler closes the sidebar only for fragment-only links. The home hook reduces same-page sidebar URLs to fragments, dismisses desktop dropdowns through the native toggle after selection, and leaves links from detail pages qualified with their language path.
- **PhotoSwipe initialization.** Hextra loads PhotoSwipe from a CDN on pages with a gallery shortcode (5.x, verified with 5.4.4). The `scripts/gallery.html` partial creates a lightbox per `[data-pswp-gallery]` container. Its instances and options are private. A standalone image can use the same lightbox by setting `id` and `data-pswp-gallery` on its container and `data-pswp-width` and `data-pswp-height` on its link. The dimensions must match the original image. Set `data-cropped="true"` on links with thumbnails cropped by `object-fit: cover` so that PhotoSwipe starts from the visible crop.
- **Gallery carousel.** Use `gallery type="carousel"` for swipe, previous/next buttons, and arrow-key navigation. A `gallery-item` with `link` opens that URL instead of PhotoSwipe. The theme styles show two slides between 481 px and 768 px regardless of `cols`.
- **Home photo without a gallery shortcode.** The home layout calls `custom/page-end.html` before the base layout loads `scripts.html`. In v0.13.0, setting the internal `hasGallery` page-store flag in that hook loads the existing PhotoSwipe initializer.
- **Poster zoom.** Set `imageZoom: true` in page front matter. The Markdown image render hook marks images as zoomable and the scripts partial fetches Medium Zoom from the CDN during the build. Event posters use a Markdown image linked to the original file, and event photos use the existing PhotoSwipe gallery.
- **Rounded thumbnail animation.** PhotoSwipe does not animate `border-radius`. During crop animation, the intersection of `.pswp__container` and the slide holder changes from the thumbnail rectangle to the viewport. Both elements use `overflow: hidden`. Animate `clip-path: inset(... round ...)` on `.pswp__scroll-wrap` with the same duration and easing to match the rounded thumbnail. Detect a `transform` `transitionrun` on `.pswp__container` and check its inline `overflow: hidden` to distinguish cropping from slide changes. The root has `pswp--ui-visible` when opening and loses it when closing. Read the duration and easing from the container's computed styles.
- **Theme default and System option.** Set `params.theme.default` to `light`, `dark`, or `system`. The System menu option is hard-coded in `theme-toggle.html`. Hiding it with CSS leaves stored `color-theme=system` preferences active. This site also normalizes the stored value in `custom/head-end.html`.
- **Menu translations.** Keep the same menu identifiers and match them in `i18n/<language>.yaml`. When destinations need language prefixes, set Hugo menu URLs per language. A fragment-only URL targets the current page, so home-section links from event pages use `/<language>/#<section>`. Hextra uses `or (T .Identifier) .Name` to fall back to the menu name. Use the `tao-` prefix to avoid colliding with Hextra's translation keys.
- **Translation directory.** Override the location with `i18nDir`. Check the effective value with `hugo config`.
- **Footer.** Hextra's built-in copyright uses the `copyright` translation key and accepts Markdown. The `displayCopyright` and `displayPoweredBy` parameters are implemented in `footer.html` and were absent from the configuration documentation reviewed. Recheck these settings when upgrading.
- **Documented extension points.** The hooks under `layouts/_partials/custom/` include `head-end`, `footer`, `page-begin`, `content-begin`, `content-end`, `page-end`, and `banner`. The reference reviewed did not list `navbar-title`.
- **Documented CSS classes.** Examples include `hextra-nav-container`, `hextra-nav-container-blur`, `hextra-footer`, `hextra-card`, `hextra-card-image`, `hextra-card-icon`, `hextra-card-subtitle`, `hextra-language-switcher`, `hextra-language-options`, `hextra-theme-toggle`, `hextra-feature-grid`, and `hextra-feature-card`. Undocumented `hx:*` utilities and DOM-dependent selectors such as `nav > a:first-child` are more likely to break on upgrade.
- **CSS variables.** Relevant variables include `--primary-hue`, `--primary-saturation`, `--primary-lightness`, `--hextra-max-page-width`, `--hextra-max-navbar-width`, and `--hextra-max-footer-width`.
- **Language configuration.** Use `languages.<code>.label` and `languages.<code>.weight`. Hugo v0.158 replaced `languageName` with `label`. The Hextra documentation reviewed did not cover redirects from the root URL.
- **Hero button.** The shortcode source opens URLs starting with `http` in a new tab. The documentation reviewed, last updated September 6, 2025, did not specify allowed `style` values or how internal and external targets are handled.
