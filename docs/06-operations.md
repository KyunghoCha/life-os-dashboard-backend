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

현재 구현은 Node 내장 `node:sqlite`를 사용한다. 로컬 smoke 실행에서 Node가 experimental warning을 출력하므로, 장기 실사용 전에 다음 중 하나를 결정해야 한다.

- Node 버전을 고정하고 현재 구현을 유지한다.
- 더 안정적인 SQLite 드라이버로 교체한다.

스키마는 현재 `schema_migrations` 테이블에 version `1`을 기록한다. 이후 컬럼 추가나 데이터 변환이 필요해지면 새 migration 파일 또는 migration runner를 추가한다.
