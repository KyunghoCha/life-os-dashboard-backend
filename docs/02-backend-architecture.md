# 백엔드 구조 설계

## 설계 목표

백엔드는 로컬 실행을 우선한다. 구현은 작게 시작하되, 나중에 실제 인증, AI 연동, 암호화를 붙일 수 있도록 도메인별 경계를 나눈다.

## 권장 기술 스택

현재 프론트가 Node.js 기반 도구인 Vite를 사용하므로, 1차 백엔드는 Node.js 런타임 위에서 구현하는 편이 작업 비용이 낮다. 권장 기본값은 다음과 같다.

- 런타임: Node.js
- HTTP 서버: Express
- 로컬 저장소: SQLite
- API 형식: JSON REST API
- 실행 위치: `C:\Projects\life-os-dashboard\backend`

이 선택은 현재 프로젝트 상황에 맞춘 권장안이다. 아직 구현으로 검증된 결정은 아니다.

## 디렉터리 구조 초안

```text
backend/
  package.json
  README.md
  data/
    life-os.sqlite
  docs/
    01-product-scope.md
    02-backend-architecture.md
    03-api-contract.md
    04-implementation-plan.md
  src/
    app.js
    server.js
    config/
      env.js
    db/
      connection.js
      schema.sql
      seed.js
    routes/
      health.js
      dashboard.js
      bugs.js
      goals.js
      xp.js
      ai.js
      vault.js
      coop.js
    services/
      dashboardService.js
      bugService.js
      goalService.js
      xpService.js
      aiService.js
      vaultService.js
      coopService.js
    repositories/
      bugRepository.js
      goalRepository.js
      profileRepository.js
      vaultRepository.js
      coopRepository.js
    middleware/
      errorHandler.js
      notFound.js
```

## 계층 책임

| 계층 | 책임 |
| --- | --- |
| `routes` | HTTP 메서드와 URL을 서비스 함수에 연결한다. 요청 파라미터를 읽고 응답 상태 코드를 정한다. |
| `services` | XP 증가, 버그 해결, Co-op 동기화 같은 앱 규칙을 처리한다. |
| `repositories` | SQLite 쿼리를 감싼다. 서비스는 SQL 세부 사항을 직접 알지 않는다. |
| `db` | 연결, 스키마, 초기 seed 데이터를 관리한다. |
| `middleware` | 공통 오류 응답과 없는 경로 처리를 담당한다. |

## 데이터 모델 초안

### `profiles`

단일 로컬 사용자를 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | text | 로컬 사용자 ID |
| `display_name` | text | 표시 이름 |
| `avatar` | text | 이니셜 또는 아이콘 |
| `tier` | text | 티어 표시 |
| `level` | integer | 레벨 |
| `xp` | integer | 현재 XP |
| `xp_target` | integer | 다음 목표 XP |
| `created_at` | text | 생성 시각 |
| `updated_at` | text | 수정 시각 |

### `bugs`

생활 버그 목록을 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | text | 버그 ID |
| `text` | text | 버그 내용 |
| `severity` | text | `critical`, `high`, `med`, `low` |
| `status` | text | `open`, `resolved` |
| `created_at` | text | 생성 시각 |
| `resolved_at` | text | 해결 시각 |

### `goals`

사용자와 파트너 목표를 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | text | 목표 ID |
| `owner_type` | text | `self`, `partner` |
| `label` | text | 목표 이름 |
| `progress` | integer | 0부터 100까지의 진행률 |
| `created_at` | text | 생성 시각 |
| `updated_at` | text | 수정 시각 |

### `xp_events`

XP 변경 기록을 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | text | 이벤트 ID |
| `delta` | integer | XP 변화량 |
| `reason` | text | 변경 이유 |
| `source_type` | text | `bug`, `goal`, `manual` |
| `source_id` | text | 원인이 된 항목 ID |
| `created_at` | text | 생성 시각 |

### `ai_advice`

AI 조언 주제와 응답 텍스트를 저장한다. 1차 구현에서는 외부 AI API 대신 정적 템플릿을 반환한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `topic` | text | 조언 주제 |
| `body` | text | 응답 본문 |
| `is_static` | integer | 정적 응답 여부 |
| `updated_at` | text | 수정 시각 |

### `vault_items`

Vault 화면의 항목과 진행률을 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | text | 항목 ID |
| `label` | text | 항목 이름 |
| `progress` | integer | 0부터 100까지의 진행률 |
| `icon` | text | 표시 아이콘 |
| `category` | text | 항목 분류 |
| `created_at` | text | 생성 시각 |
| `updated_at` | text | 수정 시각 |

### `coop_profiles`

Co-op 화면의 파트너 표시 정보를 저장한다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | text | 파트너 ID |
| `display_name` | text | 표시 이름 |
| `avatar` | text | 이니셜 |
| `tier` | text | 티어 |
| `anniversary` | text | 기준일 |
| `updated_at` | text | 수정 시각 |

## 로컬 모드 정책

1차 백엔드는 단일 사용자 로컬 모드로 동작한다. 로그인 없이 기본 프로필 하나를 seed하고, 모든 API는 해당 프로필 기준으로 응답한다.

나중에 원격 배포를 고려하면 `profiles`를 사용자 계정과 연결하고, 각 테이블에 `profile_id` 또는 `user_id`를 추가한다.

## 보안 경계

현재 프론트의 Vault는 실제 보안 기능이 아니다. 1차 백엔드도 실제 암호화를 구현하지 않는다면 API와 문서에서 `mockUnlock` 또는 `localDemo` 상태를 명확히 표시해야 한다.

실제 암호화를 구현할 경우 별도 설계가 필요하다.

- 비밀번호 또는 passphrase 입력
- 키 파생 함수 선택
- 암호화 대상 필드 결정
- 복구 불가능성 안내
- 로그와 응답에 민감 정보 미포함

## 프론트 연동 방식

프론트에는 API 클라이언트 계층을 새로 두는 편이 좋다.

```text
frontend/src/api/
  client.js
  bugs.js
  dashboard.js
  ai.js
  vault.js
  coop.js
```

API 기준 URL은 `VITE_API_BASE_URL`로 관리한다. 로컬 기본값은 `http://localhost:4000`을 권장한다.

## 오류 응답 형식

모든 오류는 같은 JSON 형태를 사용한다.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "severity must be one of critical, high, med, low",
    "details": {}
  }
}
```

## 검증 방법

- `GET /api/health`가 `ok`를 반환한다.
- seed 후 `GET /api/dashboard`가 현재 프론트 mock 화면과 같은 기본 데이터를 반환한다.
- 버그를 생성한 뒤 목록 조회에서 새 항목이 보인다.
- 버그를 해결하면 XP가 증가하고 `xp_events`에 기록된다.
- 서버를 재시작해도 SQLite 데이터가 유지된다.
