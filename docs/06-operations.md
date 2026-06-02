# 운영 명령과 데이터 관리

## 목적

이 문서는 백엔드만 관리할 때 필요한 실행, 검증, 백업, 초기화 절차를 정리한다. 프론트 진행 여부와 상관없이 백엔드 API와 로컬 데이터 저장소를 확인할 수 있어야 한다.

## 환경 변수

`.env.example`:

```env
PORT=4000
HOST=127.0.0.1
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
DB_PATH=data/life-os.sqlite
```

현재 서버 코드는 별도 `.env` 로더를 포함하지 않는다. PowerShell에서 값을 바꿀 때는 실행 전 환경 변수를 지정한다.

```powershell
$env:DB_PATH = "data/local-test.sqlite"
npm run dev
```

## 실행

```bash
npm install
npm run dev
```

기본 주소:

- API 서버: `http://127.0.0.1:4000`
- Health check: `GET /api/health`

## 검증

```bash
npm run smoke
```

`smoke`는 임시 DB인 `data/smoke.sqlite`를 사용하고 종료 시 삭제한다. 현재 확인 범위는 다음과 같다.

- health 응답
- dashboard seed 데이터
- CORS origin 응답
- bug 생성, 조회, 수정, 해결
- bug 해결 후 XP 증가와 XP event 기록
- goal 생성과 진행률 수정
- AI advice `static` mode
- Vault unlock `demo` mode
- Vault item 진행률 수정
- Co-op sync `local-demo` mode
- dashboard 재조회 시 쓰기 결과 반영

## 백업

```bash
npm run backup
```

기본 DB 경로는 `data/life-os.sqlite`이고, 백업 파일은 `backups/`에 생성된다. `backups/`는 `.gitignore`에 포함되어 GitHub에 올라가지 않는다.

다른 DB 파일을 백업하려면 `DB_PATH`를 먼저 지정한다.

```powershell
$env:DB_PATH = "data/local-test.sqlite"
npm run backup
```

백업 스크립트는 복사 전에 WAL checkpoint를 실행한다. 이 작업은 로컬 DB 파일을 단일 SQLite 파일로 보존하기 위한 절차다.

## 초기화

```bash
npm run reset -- --force
```

초기화 스크립트는 `DB_PATH`의 SQLite 파일과 `-wal`, `-shm` 파일을 삭제한다. 다음 서버 실행 시 schema와 seed 데이터가 다시 만들어진다.

주의:

- 사용자 데이터가 들어간 DB라면 먼저 `npm run backup`을 실행한다.
- `--force`가 없으면 초기화는 실행되지 않는다.

## 남은 백엔드 판단

현재 구현은 `better-sqlite3`를 사용한다. 이 선택은 Node 내장 `node:sqlite`의 release-candidate 경고를 피하고, 성숙한 SQLite driver 위에서 로컬 저장소를 운영하기 위한 것이다.

크로스 플랫폼 주의사항:

- Windows, macOS, Linux에서 사용할 수 있지만 native addon이므로 설치 시 플랫폼/아키텍처에 맞는 binary가 필요하다.
- prebuilt binary가 맞지 않는 환경에서는 C/C++ 빌드 도구가 필요할 수 있다.
- 현재 Windows 환경에서는 `npm install better-sqlite3`, `npm run smoke`, `npm run backup`이 통과했다.
- macOS/Linux 실행이 필요해지면 GitHub Actions 또는 실제 장비에서 `npm ci`와 `npm run smoke`를 돌려 확인한다.

스키마는 현재 `schema_migrations` 테이블에 version `1`을 기록한다. 이후 컬럼 추가나 데이터 변환이 필요해지면 새 migration 파일 또는 migration runner를 추가한다.
