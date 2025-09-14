# Fivlo API 연동 가이드

## 개요
Fivlo 앱의 모든 API 서비스가 제공해주신 엔드포인트에 맞춰 업데이트되었습니다.

## 서버 정보
- **배포 서버**: https://fivlo.net
- **로컬 개발**: http://localhost:8080

## 업데이트된 API 서비스

### 1. UserAPI (인증 관련) - `authApi.js`
- ✅ 회원가입: `POST /api/v1/auth/signup`
- ✅ 로그인: `POST /api/v1/auth/signin`
- ✅ 온보딩 완료: `POST /api/v1/users/onboarding`
- ✅ 사용자 정보 조회: `GET /api/v1/users/me`
- ✅ 사용자 정보 수정: `PATCH /api/v1/users/me`
- ✅ 소셜 로그인: `POST /api/v1/auth/social-login`
- ✅ 토큰 재발급: `POST /api/v1/auth/reissue`

### 2. Pomodoro API - `pomodoroApi.js`
- ✅ 목표 목록 조회: `GET /api/v1/pomodoro/goals`
- ✅ 목표 생성: `POST /api/v1/pomodoro/goals`
- ✅ 목표 수정: `PATCH /api/v1/pomodoro/goals/{goalId}`
- ✅ 목표 삭제: `DELETE /api/v1/pomodoro/goals/{goalId}`
- ✅ 세션 시작: `POST /api/v1/pomodoro/sessions/start`
- ✅ 세션 종료: `POST /api/v1/pomodoro/sessions/end`

### 3. Reminder API - `reminder.js`
- ✅ 주소 검색: `GET /api/v1/geo/search-address`
- ✅ 알림 생성: `POST /api/v1/reminders`
- ✅ 알림 목록 조회: `GET /api/v1/reminders`
- ✅ 알림 수정: `PATCH /api/v1/reminders/{reminderId}`
- ✅ 알림 삭제: `DELETE /api/v1/reminders/{reminderId}`
- ✅ 알림 완료: `PATCH /api/v1/reminders/{reminderId}/complete`
- ✅ 일일 체크 및 보상: `POST /api/v1/reminders/daily-check-and-reward`

### 4. Oboone API - `obooniApi.js`
- ✅ 상점 아이템 조회: `GET /api/v1/oboone/shop`
- ✅ 아이템 생성: `POST /api/v1/oboone/item`
- ✅ 아이템 구매: `POST /api/v1/oboone/purchase`
- ✅ 보유 아이템 조회: `GET /api/v1/oboone/closet`
- ✅ 아이템 착용: `PATCH /api/v1/oboone/equip/{userItemId}`
- ✅ 아이템 착용 해제: `PATCH /api/v1/oboone/unequip/{userItemId}`

### 5. TimeAttack API - `timeAttackApi.js`
- ✅ 목표 목록 조회: `GET /api/v1/time-attack/goals`
- ✅ 목표 생성: `POST /api/v1/time-attack/goals`
- ✅ 목표 수정: `PATCH /api/v1/time-attack/goals/{goalId}`
- ✅ 목표 삭제: `DELETE /api/v1/time-attack/goals/{goalId}`
- ✅ 단계 추천: `POST /api/v1/time-attack/recommend-steps`
- ✅ 세션 생성: `POST /api/v1/time-attack/sessions`
- ✅ 세션 목록 조회: `GET /api/v1/time-attack/sessions`

### 6. Task & Categories API - `taskApi.js`
- ✅ 카테고리 생성: `POST /api/v1/categories`
- ✅ 카테고리 목록 조회: `GET /api/v1/categories`
- ✅ 카테고리 수정: `PATCH /api/v1/categories/{categoryId}`
- ✅ 카테고리 삭제: `DELETE /api/v1/categories/{categoryId}`
- ✅ Task 생성: `POST /api/v1/tasks`
- ✅ Task 목록 조회: `GET /api/v1/tasks?date=YYYY-MM-DD`
- ✅ Task 수정: `PATCH /api/v1/tasks/{taskId}`
- ✅ Task 완료: `PATCH /api/v1/tasks/{taskId}/complete`
- ✅ Task 삭제: `DELETE /api/v1/tasks/{taskId}`
- ✅ AI 목표 생성: `POST /api/v1/ai/goals`
- ✅ AI 목표별 태스크 생성: `POST /api/v1/ai/goals/tasks`
- ✅ Task 코인 지급: `POST /api/v1/tasks/coins`

### 7. Growth Album API - `growthAlbumApi.js` (신규 생성)
- ✅ Presigned URL 요청: `POST /api/v1/growth-album/upload/presigned-url`
- ✅ 사진 업로드: `POST /api/v1/tasks/{taskId}/growth-album`
- ✅ 캘린더 조회: `GET /api/v1/growth-album/calendar?year=YYYY&month=MM`
- ✅ 카테고리 조회: `GET /api/v1/growth-album/categories`
- ✅ 상세 조회: `GET /api/v1/growth-album/{albumId}`

### 8. Analysis API - `analysisApi.js`
- ✅ 일간 분석: `GET /api/v1/analysis/daily?date=YYYY-MM-DD`
- ✅ 주간 분석: `GET /api/v1/analysis/weekly?start_date=YYYY-MM-DD`
- ✅ 월간 분석: `GET /api/v1/analysis/monthly?year=YYYY&month=MM`
- ✅ 월간 AI 제안: `GET /api/v1/analysis/monthly/ai-suggestions?year=YYYY&month=MM`
- ✅ 목표 분석 생성: `POST /api/v1/analysis/goals`
- ✅ 목표 분석 조회: `GET /api/v1/analysis/goals/{goalId}`

## 사용 방법

### 1. 기본 사용법
```javascript
import { login, getUserInfo } from '../services/authApi';
import { getPomodoroGoals } from '../services/pomodoroApi';

// 로그인
const userData = await login('user@example.com', 'password');

// 사용자 정보 조회
const userInfo = await getUserInfo();

// 포모도로 목표 조회
const goals = await getPomodoroGoals();
```

### 2. 환경별 API 클라이언트
- **배포 환경**: `apiClient.js` (https://fivlo.net)
- **개발 환경**: `devApiClient.js` (http://localhost:8080)

### 3. 에러 처리
모든 API 호출은 자동으로 에러 처리가 되며, 401 에러 시 자동으로 로그아웃 처리됩니다.

## 주의사항
1. 모든 API는 인증 토큰이 필요합니다 (로그인 후 자동으로 헤더에 추가)
2. 토큰 만료 시 자동으로 재발급을 시도합니다
3. 네트워크 에러 시 적절한 에러 메시지가 표시됩니다
4. 개발 시에는 `devApiClient.js`를 사용하여 로컬 서버와 연동할 수 있습니다

## 다음 단계
1. 각 화면에서 해당 API 서비스를 import하여 사용
2. 실제 데이터와 연동하여 UI 업데이트
3. 에러 처리 및 로딩 상태 관리
4. 사용자 경험 개선을 위한 추가 기능 구현
