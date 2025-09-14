# Google 로그인 설정 가이드

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: "Fivlo App" (또는 원하는 이름)

### 1.2 OAuth 2.0 클라이언트 ID 생성
1. **API 및 서비스** > **사용자 인증 정보** 이동
2. **사용자 인증 정보 만들기** > **OAuth 2.0 클라이언트 ID** 선택
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: "Fivlo Web Client"
5. 승인된 리디렉션 URI 추가:
   ```
   https://auth.expo.io/@your-expo-username/fivlo
   ```
   (your-expo-username을 실제 Expo 사용자명으로 교체)

### 1.3 Android 클라이언트 ID 생성
1. **사용자 인증 정보 만들기** > **OAuth 2.0 클라이언트 ID** 선택
2. 애플리케이션 유형: **Android**
3. 이름: "Fivlo Android"
4. 패키지 이름: `com.yourcompany.fivlo` (app.json의 package와 일치)
5. SHA-1 인증서 지문: Expo 개발 빌드의 SHA-1 지문

### 1.4 iOS 클라이언트 ID 생성
1. **사용자 인증 정보 만들기** > **OAuth 2.0 클라이언트 ID** 선택
2. 애플리케이션 유형: **iOS**
3. 이름: "Fivlo iOS"
4. 번들 ID: `com.yourcompany.fivlo` (app.json의 bundleIdentifier와 일치)

## 2. Expo 설정

### 2.1 app.json 업데이트
```json
{
  "expo": {
    "name": "Fivlo",
    "slug": "fivlo",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.fivlo"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.fivlo"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "scheme": "fivlo",
    "plugins": [
      [
        "expo-auth-session",
        {
          "schemes": ["fivlo"]
        }
      ]
    ]
  }
}
```

### 2.2 Google Client ID 설정
`src/services/googleAuthService.js` 파일에서:
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
```

**중요**: Google Cloud Console에서 생성한 웹 클라이언트 ID를 위의 `YOUR_WEB_CLIENT_ID` 부분에 입력하세요.

예시:
```javascript
const GOOGLE_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
```

## 3. SHA-1 지문 확인 (Android)

### 3.1 Expo 개발 빌드 SHA-1 지문
```bash
expo credentials:manager -p android
```

### 3.2 로컬 개발용 SHA-1 지문
```bash
# Windows
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android

# macOS/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## 4. 테스트

### 4.1 개발 빌드 생성
```bash
expo build:android
expo build:ios
```

### 4.2 로그인 테스트
1. 앱 실행
2. 온보딩 → 인증 선택 → Google 로그인
3. Google 계정 선택 및 권한 승인
4. 목적 선택 → 메인 화면 이동 확인

## 5. 문제 해결

### 5.1 일반적인 오류
- **"Invalid client"**: Client ID가 올바르지 않음
- **"Redirect URI mismatch"**: 리디렉션 URI가 일치하지 않음
- **"Package name mismatch"**: Android 패키지명이 일치하지 않음
- **"Bundle ID mismatch"**: iOS 번들 ID가 일치하지 않음

### 5.2 디버깅
```javascript
// googleAuthService.js에서 디버깅 로그 추가
console.log('Google Client ID:', GOOGLE_CLIENT_ID);
console.log('Redirect URI:', GOOGLE_REDIRECT_URI);
console.log('Auth URL:', url);
```

## 6. 보안 고려사항

### 6.1 Client ID 보안
- Client ID는 공개되어도 안전하지만, 민감한 정보와 함께 노출되지 않도록 주의
- 서버사이드에서는 Client Secret 사용

### 6.2 토큰 관리
- Access Token은 클라이언트에 저장하지 않음
- ID Token을 서버로 전송하여 검증
- Refresh Token은 안전하게 저장

## 7. 프로덕션 배포

### 7.1 프로덕션 빌드
```bash
expo build:android --type app-bundle
expo build:ios --type archive
```

### 7.2 Google Play Console 설정
1. Google Play Console에서 앱 등록
2. 서명 인증서의 SHA-1 지문을 Google Cloud Console에 추가

### 7.3 App Store Connect 설정
1. App Store Connect에서 앱 등록
2. 번들 ID를 Google Cloud Console에 추가
