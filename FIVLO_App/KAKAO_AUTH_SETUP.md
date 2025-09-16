# 카카오 로그인 설정 가이드

## 1. 카카오 개발자 콘솔 설정

### 1.1 앱 등록
1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 접속
2. "내 애플리케이션" → "애플리케이션 추가하기" 클릭
3. 앱 이름, 사업자명 입력 후 생성

### 1.2 플랫폼 설정
1. 생성된 앱 선택 → "플랫폼" 메뉴
2. **Android 플랫폼 추가**:
   - 패키지명: `com.fivlo.app` (실제 패키지명에 맞게 수정)
   - 키 해시: 개발용 키 해시 등록
3. **iOS 플랫폼 추가**:
   - 번들 ID: `com.fivlo.app` (실제 번들 ID에 맞게 수정)

### 1.3 카카오 로그인 활성화
1. "제품 설정" → "카카오 로그인" 메뉴
2. "카카오 로그인 활성화" ON
3. **Redirect URI 설정**:
   - Android: `kakao906b442258e88daee2f317ab9bb566e1://oauth`
   - iOS: `kakao906b442258e88daee2f317ab9bb566e1://oauth`
   - **Expo 환경 추가**: 
     - `fivlo://kakao-auth`
     - `https://auth.expo.io/@woojung1234/FIVLO_App` (Expo Go용)

### 1.4 동의항목 설정
**현재 구현에서는 동의 항목을 요청하지 않습니다.**
- 클라이언트에서는 인증 코드(code)만 받아옵니다
- 사용자 정보는 서버에서 처리합니다
- 동의 항목 설정이 필요하지 않습니다

## 2. 앱 키 정보 확인
1. "앱 설정" → "앱 키" 메뉴에서 다음 정보 확인:
   - **네이티브 앱 키**: `kakaoAuthService.js`의 `YOUR_KAKAO_NATIVE_APP_KEY` 부분에 입력
   - **REST API 키**: 필요시 사용

## 3. 코드 설정

### 3.1 Expo 환경에서의 카카오 로그인
Expo 환경에서는 네이티브 카카오 SDK 대신 웹 기반 OAuth를 사용합니다.

**app.json 설정**:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLName": "KakaoAuth",
            "CFBundleURLSchemes": ["kakao906b442258e88daee2f317ab9bb566e1"]
          },
          {
            "CFBundleURLName": "FivloApp", 
            "CFBundleURLSchemes": ["fivlo"]
          }
        ]
      }
    }
  }
}
```

**kakaoAuthService.js는 이미 Expo 환경에 맞게 구현되어 있습니다.**

### 3.2 Android 설정 (android/app/src/main/AndroidManifest.xml)
```xml
<activity
    android:name="com.kakao.sdk.auth.AuthCodeHandlerActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="kakao{YOUR_NATIVE_APP_KEY}" />
    </intent-filter>
</activity>
```

### 3.3 iOS 설정 (app.json)
Expo 프로젝트의 경우 `app.json`에서 iOS 설정을 관리합니다:

```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.fivlo.app",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLName": "KakaoAuth",
            "CFBundleURLSchemes": ["kakao906b442258e88daee2f317ab9bb566e1"]
          }
        ]
      }
    }
  }
}
```

**네이티브 iOS 프로젝트인 경우 (ios/FIVLO_App/Info.plist)**:
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>KakaoAuth</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>kakao906b442258e88daee2f317ab9bb566e1</string>
        </array>
    </dict>
</array>
```

## 4. 키 해시 생성 (Android)

### 4.1 개발용 키 해시
```bash
# Windows (PowerShell)
keytool -exportcert -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore -storepass android -keypass android | openssl sha1 -binary | openssl base64

# macOS/Linux
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore -storepass android -keypass android | openssl sha1 -binary | openssl base64
```

### 4.2 릴리즈용 키 해시
```bash
# 릴리즈 키스토어 파일 경로로 변경
keytool -exportcert -alias YOUR_ALIAS -keystore YOUR_KEYSTORE_PATH -storepass YOUR_PASSWORD -keypass YOUR_PASSWORD | openssl sha1 -binary | openssl base64
```

## 5. 테스트

### 5.1 로그인 플로우
1. 앱 실행
2. "카카오로 시작하기" 버튼 클릭
3. 카카오 로그인 화면에서 로그인
4. 권한 동의
5. 앱으로 돌아와서 로그인 완료

### 5.2 디버깅
- 콘솔에서 카카오 로그인 관련 로그 확인
- 네트워크 탭에서 API 호출 확인
- 카카오 개발자 콘솔에서 로그인 통계 확인

## 6. 주의사항

1. **보안**: 네이티브 앱 키는 클라이언트에 노출되므로 민감한 정보는 포함하지 않음
2. **테스트**: 개발/스테이징/프로덕션 환경별로 다른 앱 키 사용 권장
3. **권한**: 필요한 최소한의 권한만 요청
4. **에러 처리**: 네트워크 오류, 사용자 취소 등 다양한 상황에 대한 에러 처리 구현

## 7. 문제 해결

### 7.1 일반적인 오류
- **"앱이 등록되지 않음"**: 패키지명/번들 ID 확인
- **"리다이렉트 URI 불일치"**: 카카오 개발자 콘솔의 Redirect URI 설정 확인
- **"키 해시 불일치"**: Android 키 해시 재생성 및 등록

### 7.2 Expo Go 환경에서의 문제
**문제**: 카카오 로그인이 취소되거나 실패하는 경우

**해결 방법**:
1. **카카오 개발자 콘솔에 Expo Redirect URI 추가**:
   ```
   https://auth.expo.io/@woojung1234/FIVLO_App
   ```

2. **Expo Go의 제한사항**:
   - Expo Go에서는 커스텀 스키마가 제한적으로 작동
   - `useProxy: true` 옵션으로 Expo 프록시 사용
   - 개발 빌드 사용 권장

3. **개발 빌드 생성** (권장):
   ```bash
   # EAS Build로 개발 빌드 생성
   eas build --profile development --platform android
   eas build --profile development --platform ios
   ```

### 7.3 Expo 프록시 리다이렉트 문제 (해결됨)
**문제**: "Something went wrong trying to finish signing in" 오류 페이지가 표시되는 경우

**원인**: Expo Go 환경에서 `https://auth.expo.io/@woojung1234/FIVLO_App` 프록시를 통한 리다이렉트가 실패

**해결 방법**:
1. **새로운 Expo Go 전용 서비스 사용**:
   - `kakaoAuthServiceExpoGo.js` 구현 완료
   - 브라우저에서 직접 로그인 후 수동 인증 코드 입력 방식

2. **사용 방법**:
   - 카카오 로그인 버튼 클릭
   - 브라우저에서 카카오 로그인 완료
   - 받은 인증 코드를 앱에 입력
   - 로그인 완료

3. **장점**:
   - Expo 프록시 문제 완전 해결
   - 안정적인 로그인 플로우
   - 구글 로그인과 동일한 문제 해결

### 7.4 동의 항목 오류 (KOE205) 해결
**문제**: "잘못된 요청 (KOE205)" 오류가 발생하는 경우

**해결 방법**:
1. **현재 구현에서는 동의 항목을 요청하지 않습니다**:
   - `scope=profile_nickname,account_email` 제거
   - 인증 코드(code)만 받아오도록 설정
   - 사용자 정보는 서버에서 처리

2. **카카오 개발자 콘솔 설정**:
   - 동의 항목 설정이 필요하지 않습니다
   - 기본 로그인만 활성화하면 됩니다

### 7.5 Redirect URI 등록 오류 해결
**문제**: "등록을 안했다" 또는 "invalid_request" 오류가 발생하는 경우

**해결 방법**:
1. **카카오 개발자 콘솔에 다음 URI들을 모두 등록**:
   ```
   https://auth.expo.io/@woojung1234/FIVLO_App
   fivlo://kakao-auth
   kakao906b442258e88daee2f317ab9bb566e1://oauth
   ```

2. **URI 등록 시 주의사항**:
   - 정확한 대소문자와 특수문자 사용
   - 슬래시(/)와 콜론(:) 정확히 입력
   - 공백이나 추가 문자 없이 입력

3. **등록 후 확인**:
   - 카카오 개발자 콘솔에서 "저장" 버튼 클릭
   - 설정이 반영될 때까지 1-2분 대기
   - 앱 재시작 후 테스트

### 7.7 로그 확인
```javascript
// 디버깅을 위한 로그 추가
console.log('카카오 로그인 결과:', result);
console.log('카카오 프로필:', profile);
console.log('리다이렉트 URI:', redirectUri);
```
