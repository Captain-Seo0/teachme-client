# TeachMe Client

티치미(TeachMe) 앱의 클라이언트. React Native + Expo (expo-router, TypeScript), 백엔드는 Supabase.

## 시작하기
```bash
npm install
cp .env.example .env   # EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY 입력
npx expo start
```

## 구조
```
app/
  (onboarding)/  splash, login, email-login, signup, profile, school, concern, welcome
  (tabs)/        index(홈), teachtok, my
  lesson/        subject, upload, student, ready, live, end, report
src/
  components/  features/{onboarding,lesson,report,teachtok,my}/  hooks/  theme/  types/
  lib/supabase.ts   Supabase 클라이언트 (세션: expo-secure-store)
  lib/api.ts        Edge Function 호출 래퍼
```

현재는 뼈대(placeholder 화면)만 있으며 UI/기능은 Figma 디자인 확정 후 구현합니다.
개발 원칙은 [CLAUDE.md](CLAUDE.md)를 참고하세요.
