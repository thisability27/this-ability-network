<div align="center">

# This Ability Network

<img width="220" src="https://raw.githubusercontent.com/thisability27/this-ability-network/main/assets/image/network-logo-color.png" alt="This Ability Network logo" />

[![Hugo 0.170.1](https://img.shields.io/badge/Hugo-0.170.1-FF4088?logo=hugo&logoColor=white)](.github/workflows/pages.yaml)
[![Hextra 0.13.0](https://img.shields.io/badge/Hextra-0.13.0-525DDC)](go.mod)
[![Go 1.27.3](https://img.shields.io/badge/Go-1.27.3-007A96?logo=go&logoColor=white)](go.mod)
[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub%20Pages-222222?logo=githubpages&logoColor=white)](.github/workflows/pages.yaml)

[한국어](README-ko.md) · **[English](README-en.md)**

This bilingual brand site introduces This Ability Network, a Los Angeles nonprofit, and its main program, This Ability Orchestra. It shares the orchestra’s performances, upcoming events, and ways to get involved.

</div>

## Run Locally

Use Hugo 0.170.1 and Go 1.27.3 to match the deployment workflow. Start the development server from the repository root.

```sh
hugo server --bind 127.0.0.1 --port 8774
```

Open the [English](http://127.0.0.1:8774/en/) or [Korean](http://127.0.0.1:8774/ko/) site.

## Editing Content

Edit the English and Korean home pages in `content/_index.en.md` and `content/_index.ko.md`, respectively. The event archive and event pages are in `content/events/`, menu translations are in `i18n/`, and site settings are in `hugo.toml`. Update both languages when changing copy or image alt text.

Original images and web-ready variants are stored in `assets/image/`. The existing `/assets/image/` URLs continue to work after a Hugo build.

## Hosting

Run `hugo --panicOnWarning` to build the English and Korean pages into `public/`. When changes reach `main`, GitHub Actions runs the same command and deploys the output to GitHub Pages.

## Changelog and Versioning

Use Changesets to record changes in Korean. See [the changelog](CHANGELOG.md) for release notes.

1. Run `npm ci` to install the versioning tools.
2. For each change, run `npm run changeset` and select the appropriate `patch`, `minor`, or `major` bump.
3. Run `npm run changeset:status` to check the planned version.
4. At release time, run `npm run release:version` to update the version, lockfile, and `CHANGELOG.md`. Review the generated changes, then create the release commit and version tag.
