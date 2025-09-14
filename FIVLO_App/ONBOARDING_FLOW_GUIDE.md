# Fivlo 온보딩 플로우 가이드

## 개요
Fivlo 앱의 온보딩 및 회원가입 플로우가 완전히 재구성되었습니다. 소셜 로그인 후 목적 선택 페이지가 표시되도록 구현되었습니다.

## 새로운 플로우

### 1. 온보딩 화면 (OnboardingScreen)
- **목적**: 앱 소개 및 환영 메시지
- **내용**: 
  - FIVLO 로고 표시
  - 오분이 캐릭터 이미지
  - 환영 메시지: "FIVLO에 오신 것을 환영합니다!"
  - 앱 설명: "짧은 몰입이 긴 변화를 만듭니다. 삶을 바꾸는 집중 루틴 플랫폼"
  - 2초 후 "시작하기" 버튼 표시
- **다음 단계**: PurposeSelection 화면으로 이동

### 2. 목적 선택 화면 (PurposeSelectionScreen)
- **목적**: 사용자가 FIVLO를 사용하는 목적 선택
- **옵션**:
  - 집중력 개선
  - 루틴 형성  
  - 목표 관리
- **다음 단계**: AuthChoice 화면으로 이동

### 3. 인증 선택 화면 (AuthChoiceScreen)
- **목적**: 로그인 방법 선택
- **옵션**:
  - Google로 시작하기
  - Apple로 시작하기
  - 이메일로 시작하기
  - 로그인하기 (기존 사용자)

### 4. 소셜 로그인 후 플로우
#### Google/Apple 로그인 성공 시:
1. **목적 선택 화면으로 다시 이동** (isSocialLogin: true)
2. 환영 메시지 표시: "Google/Apple 로그인이 완료되었습니다!"
3. 목적 선택 후 온보딩 완료 API 호출
4. **메인 화면으로 이동**

#### 이메일 회원가입 성공 시:
1. **목적 선택 화면으로 이동** (isSocialLogin: false)
2. 목적 선택 후 온보딩 완료 API 호출
3. **메인 화면으로 이동**

#### 이메일 로그인 성공 시:
1. **메인 화면으로 바로 이동** (기존 사용자)

## 플로우 다이어그램

```
OnboardingScreen
       ↓
PurposeSelectionScreen
       ↓
AuthChoiceScreen
       ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   Google Login  │   Apple Login   │  Email SignUp   │
│        ↓        │        ↓        │        ↓        │
│ PurposeSelection│ PurposeSelection│ PurposeSelection│
│ (isSocialLogin) │ (isSocialLogin) │ (isSocialLogin) │
│        ↓        │        ↓        │        ↓        │
│   Main Screen   │   Main Screen   │   Main Screen   │
└─────────────────┴─────────────────┴─────────────────┘
       ↓
EmailLoginScreen
       ↓
   Main Screen
```

## 주요 변경사항

### 1. OnboardingScreen
- ✅ 목적 선택 기능 제거
- ✅ 환영 메시지 및 앱 소개 추가
- ✅ "시작하기" 버튼으로 PurposeSelection 이동

### 2. PurposeSelectionScreen
- ✅ 소셜 로그인 후 재진입 지원
- ✅ 로그인 완료 메시지 표시
- ✅ 온보딩 완료 API 호출
- ✅ 메인 화면으로 네비게이션 리셋

### 3. AuthChoiceScreen
- ✅ Google/Apple 로그인 구현
- ✅ 로딩 상태 표시
- ✅ 소셜 로그인 성공 후 PurposeSelection으로 이동
- ✅ 에러 처리 및 사용자 피드백

### 4. EmailSignUpScreen
- ✅ 회원가입 성공 후 PurposeSelection으로 이동
- ✅ 온보딩 플로우 통합

### 5. EmailLoginScreen
- ✅ 로그인 성공 후 메인 화면으로 바로 이동
- ✅ 네비게이션 스택 리셋

## API 연동

### 소셜 로그인 API
```javascript
// Google 로그인
const response = await socialLogin('google', 'google_token');

// Apple 로그인  
const response = await socialLogin('apple', 'apple_token');
```

### 온보딩 완료 API
```javascript
const response = await completeOnboarding({
  purpose: '집중력개선', // 또는 '루틴형성', '목표관리'
  provider: 'google' // 또는 'apple', 'email'
});
```

## 개발 환경 지원

### 개발용 모의 로그인
- Google: `google@example.com` / `google123`
- Apple: `apple@example.com` / `apple123`
- 이메일: 사용자 입력

### 개발용 데이터 초기화
- HomeScreen에서 자동으로 개발용 샘플 데이터 생성
- 태스크, 코인, 사용자 정보 등

## 사용자 경험 개선

### 1. 직관적인 플로우
- 온보딩 → 목적 선택 → 인증 → 메인 화면
- 소셜 로그인 후에도 목적 선택으로 돌아가서 완전한 온보딩

### 2. 명확한 피드백
- 로그인 완료 메시지
- 로딩 상태 표시
- 에러 메시지 및 재시도 안내

### 3. 일관된 네비게이션
- 소셜 로그인과 이메일 회원가입 모두 동일한 온보딩 완료 플로우
- 기존 사용자는 바로 메인 화면으로 이동

## 다음 단계
1. 실제 소셜 로그인 SDK 연동 (Google, Apple)
2. 온보딩 완료 후 사용자 설정 저장
3. 목적별 맞춤형 초기 설정 제공
4. 온보딩 완료 통계 및 분석
