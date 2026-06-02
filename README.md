# Life OS Dashboard Backend

이 디렉터리는 `Life OS Dashboard`의 백엔드 작업 공간이다. 현재는 문서와 1차 로컬 API 구현이 함께 존재한다. 프론트엔드는 `../frontend`에 있으며, 현재 화면은 `src/api/client.js`를 통해 백엔드 API를 호출하는 구조로 전환되었다.

## 문서

- [제품 범위와 요구사항](docs/01-product-scope.md)
- [백엔드 구조 설계](docs/02-backend-architecture.md)
- [API 계약 초안](docs/03-api-contract.md)
- [구현 계획](docs/04-implementation-plan.md)
- [실사용 최종 로드맵](docs/05-final-roadmap.md)
- [운영 명령과 데이터 관리](docs/06-operations.md)

## 현재 기준

- 앱 이름: `life-os-dashboard`
- 프론트 제목: `Life OS Dashboard`
- 실행 형태: 브라우저에서 동작하는 React/Vite 웹앱
- 백엔드 현재 상태: Express API와 SQLite 저장소가 있으며 `npm run smoke`로 기본 API 흐름을 확인한다.
- 프론트 현재 상태: `GET /api/dashboard`, 버그 추가/해결, AI 조언, Vault demo unlock/진행률 수정, Co-op sync API를 호출한다.
- 다음 목표: 브라우저에서 실제 클릭 흐름과 새로고침 후 데이터 유지까지 확인하고, 루트 실행 방식을 정리한다.

## 실행

```bash
npm install
npm run dev
```

기본 서버 주소는 `http://127.0.0.1:4000`이다. 환경 변수 예시는 `.env.example`에 있다.

## 데이터 관리

```bash
npm run backup
npm run reset -- --force
npm run smoke
```

- `npm run backup`은 현재 SQLite DB를 `backups/` 아래에 복사한다.
- `npm run reset -- --force`는 `DB_PATH`의 SQLite 파일과 WAL/SHM 파일을 삭제한다.
- `npm run smoke`는 API 주요 흐름과 CORS 응답을 임시 DB로 검증한다.

## 구현 전 원칙

1. 프론트의 현재 mock 기능을 실제 데이터 계약으로 치환한다.
2. 로컬 우선 구조로 시작한다.
3. 인증, 실제 AI 연동, 실제 암호화는 1차 구현의 필수 범위로 두지 않는다.
4. 보안처럼 보이는 UI 문구와 실제 보안 구현 수준이 어긋나지 않게 문서와 응답을 맞춘다.
5. 구현 후에는 프론트에서 API를 호출하도록 단계적으로 연결한다.
