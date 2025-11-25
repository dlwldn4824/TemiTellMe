# Android에서 아이콘/이미지 미표시 문제 해결 가이드

## 🔍 문제 원인

웹 브라우저에서는 보이던 아이콘들이 Android WebView에서 안 보이는 이유:

1. **절대 경로 문제**: `/assets/...` 같은 절대 경로는 Android WebView의 `file:///android_asset/www/` 구조에서 제대로 해석되지 않을 수 있습니다.
2. **잘못된 상대 경로**: `src/assets/...` 같은 경로는 빌드 후 존재하지 않습니다.

## ✅ 해결 방법

### 방법 1: Import 방식 사용 (권장) ✨

이미지를 import해서 사용하면 Vite가 빌드 시 올바른 경로로 변환해줍니다.

**수정 전:**
```jsx
<img src="/assets/ExhibitionGuide/icon.png" />
```

**수정 후:**
```jsx
import iconImage from "../assets/ExhibitionGuide/icon.png";

<img src={iconImage} />
```

### 방법 2: 상대 경로 사용

`public` 폴더의 이미지는 빌드 후 `assets` 폴더로 복사됩니다. 상대 경로를 사용하세요.

**수정 전:**
```jsx
<img src="/assets/ExhibitionGuide/icon.png" />
```

**수정 후:**
```jsx
<img src="./assets/ExhibitionGuide/icon.png" />
// 또는
<img src="assets/ExhibitionGuide/icon.png" />
```

## 📝 수정된 파일

### 1. `ExhibitionGuide.tsx` ✅
- 절대 경로 `/assets/...`를 import 방식으로 변경
- 4개의 아이콘 이미지 수정 완료

### 2. `Line.jsx` ✅ (부분 완료)
- 인어테미 이미지 수정 완료
- QR 코드 이미지는 추가 작업 필요 (아래 참고)

## ⚠️ 추가로 수정이 필요한 파일

### `Line.jsx`, `TemiGuide.jsx`, `QuickSearchDetail.jsx`

이 파일들에서 QR 코드 이미지를 동적으로 로드하고 있습니다:

```jsx
qrImage: "src/assets/지능형로봇 QR코드/경주로봇 만들기.png"
```

**해결 방법:**

#### 옵션 1: Import 방식으로 변경 (권장)

```jsx
// 모든 QR 이미지 import
import qr1 from "../assets/지능형로봇 QR코드/경주로봇 만들기.png";
import qr2 from "../assets/지능형로봇 QR코드/로봇아 멍멍해봐 4족보행로봇 활용 체험.png";
// ... 나머지도 import

const BUTTONS = [
  {
    id: 1,
    qrImage: qr1,  // import된 변수 사용
  },
  // ...
];
```

#### 옵션 2: 공통 모듈 생성

`src/lib/qrImages.js` 파일 생성:

```js
// src/lib/qrImages.js
import qr1 from "../assets/지능형로봇 QR코드/경주로봇 만들기.png";
import qr2 from "../assets/지능형로봇 QR코드/로봇아 멍멍해봐 4족보행로봇 활용 체험.png";
// ... 모든 QR 이미지 import

export const QR_IMAGES = {
  "경주로봇 만들기": qr1,
  "로봇아 멍멍해봐": qr2,
  // ...
};
```

그리고 사용:

```jsx
import { QR_IMAGES } from "../lib/qrImages";

const BUTTONS = [
  {
    id: 1,
    title: "경주로봇 만들기",
    qrImage: QR_IMAGES["경주로봇 만들기"],
  },
];
```

## 🧪 테스트 방법

### 1. 웹 브라우저에서 테스트
```bash
cd co-show
pnpm run dev
```
브라우저에서 아이콘이 정상적으로 보이는지 확인

### 2. Android에서 테스트

1. **빌드 및 복사:**
```bash
cd co-show
pnpm run build
cp -r dist/* android/app/src/main/assets/www/
```

2. **Android Studio에서 실행:**
   - Run Configuration으로 앱 실행
   - 아이콘이 정상적으로 표시되는지 확인

3. **실제 로봇에서 테스트:**
   - APK 빌드 후 테미 로봇에 설치
   - 실제 환경에서 확인

## 🔧 추가 체크리스트

다음 항목들을 확인하세요:

- [ ] 모든 절대 경로(`/assets/...`) 제거
- [ ] 모든 `src/assets/...` 경로 import로 변경
- [ ] public 폴더 이미지는 상대 경로(`./assets/...`) 사용
- [ ] 빌드 후 `dist/assets` 폴더에 이미지가 있는지 확인
- [ ] Android assets 폴더에 이미지가 복사되었는지 확인

## 📂 파일 경로 확인

빌드 후 다음 경로들을 확인하세요:

1. **웹 빌드 결과:**
   ```
   co-show/dist/assets/...
   ```

2. **Android assets:**
   ```
   co-show/android/app/src/main/assets/www/assets/...
   ```

## 💡 향후 개발 시 주의사항

1. **새로운 이미지 추가 시:**
   - `src/assets/` 폴더에 추가하고 import 방식 사용
   - 절대 경로 사용 지양

2. **동적 이미지 로딩:**
   - 이미지 이름이 동적인 경우, import를 사용할 수 없으므로
   - `public/assets/` 폴더에 넣고 상대 경로 사용
   - 또는 이미지 이름 매핑 객체 생성

3. **테스트:**
   - 웹 브라우저에서 확인 후
   - Android에서도 반드시 확인

## ❓ 문제가 계속되면

1. **브라우저 개발자 도구:**
   - Android Studio → Logcat
   - WebView 오류 메시지 확인

2. **파일 확인:**
   ```bash
   # 빌드된 이미지 확인
   ls -la co-show/dist/assets/
   
   # Android assets 확인
   ls -la co-show/android/app/src/main/assets/www/assets/
   ```

3. **캐시 삭제:**
   - Android Studio에서 앱 삭제 후 재설치
   - 또는 `adb uninstall com.example.coshowsample` 후 재설치





