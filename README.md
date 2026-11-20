<div align="center">

# thisability27/this-ability-network

This Ability Network와 This Ability Orchestra의 한영 웹사이트입니다.

</div>

## 로컬 미리보기

저장소 루트에서 미리보기 서버를 시작합니다.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

브라우저에서 [로컬 사이트](http://127.0.0.1:8000/)를 엽니다.

## 콘텐츠 편집

`index.html`에 페이지, 스타일, 언어 및 테마 전환 스크립트가 들어 있습니다. 영문 문구와 대응하는 한글 번역을 함께 수정합니다. 언어 전환 시 이미지 대체 텍스트도 바뀝니다. 테마는 처음에 기기 설정을 따르며, 버튼으로 선택한 테마는 최대 1년 동안 쿠키에 저장됩니다.

`assets/image/`에는 전달받은 HTML에 내장되어 있던 JPEG 이미지 10장을 담고 있습니다. 이미지는 재인코딩하지 않았으며, 페이지는 이미지 파일을 상대 경로로 불러옵니다. 헤더에는 원본 `network-logo.jpg`를 사용하고, 별도 랜딩 페이지에서 쓰는 투명 PNG도 보관합니다.

## 호스팅

`main`에 푸시하면 GitHub Actions가 `index.html`과 `assets/image/`를 GitHub Pages에 배포합니다. 빌드 명령이나 런타임 의존성은 없습니다.

이미지는 HTML에서 `assets/image/파일명.jpg`처럼 상대 경로로 참조합니다. 배포 주소에서도 같은 경로를 사용합니다. [이미지 주소 예시](https://this.ability-net.work/assets/image/network-logo.jpg)

## 변경 기록과 버전

Changesets를 사용해 변경 내용을 한글로 기록합니다. 지금 준비하는 첫 버전은 `v0.1.0`입니다.

1. `npm ci`로 버전 관리에 필요한 개발 도구를 설치합니다.
2. 변경이 있을 때 `npm run changeset`을 실행하고 변경에 맞는 `patch`, `minor`, `major`를 선택합니다.
3. `npm run changeset:status`로 예정된 버전을 확인합니다.
4. 릴리스할 때만 `npm run release:version`을 실행해 버전, 잠금 파일, `CHANGELOG.md`를 갱신합니다. 생성된 변경을 검토한 뒤 릴리스 커밋과 버전 태그를 만듭니다.
