# TeachMe Client — Claude 작업 지침

React Native + Expo(expo-router, TypeScript) 클라이언트. 백엔드는 Supabase.
기획: `docs/teachme-plan.md` / 서버 API 명세: teachme-server 레포 `docs/api-spec.md`.

## 프로젝트 개요
- **서비스 한 줄 설명**: 사용자가 선생님이 되어 AI 학생(답답이·초롱이·똑똑이·깐족이)을 가르치며, 말로 설명하는 능동적 인출 학습으로 "안다는 착각"을 줄이는 학습 앱.
- **핵심 흐름**: 온보딩(소셜 로그인 → 프로필 → 학교·학년 → 공부 고민 → 첫 AI 학생 매칭) → 홈(시험 D-Day) → 수업 준비(과목·단원 → 교재 업로드 → AI 학생 선택) → 가르치기 라이브(READY → 음성 설명·메모·힌트 → 종료) → AI 분석 리포트 → 하이라이트 숏폼 → 티치톡 게시.
- **앱이 맡는 일**: 화면/UI, 마이크 녹음·교재 파일 업로드·숏폼 재생 등 기기 기능, Supabase Auth 로그인, 단순 CRUD(RLS 전제). 하단 탭은 홈·티치톡·마이.
- **앱이 맡지 않는 일**: STT/LLM/RAG/TTS 같은 AI 호출, 숏폼 렌더링(Creatomate)은 서버 Edge Functions가 처리하고 앱은 `src/lib/api.ts`로 호출만 한다.
- 프로토타입 목표는 심사 현장에서 온보딩부터 티치톡 게시까지 실제로 동작하는 전체 시연이다. 댓글·팔로우·DM·알림은 화면과 기본 동작 위주.

## 원칙
- 앱에는 AI/외부 서비스 키를 넣지 않는다. AI가 필요한 기능은 서버 Edge Function을 `src/lib/api.ts`를 통해 호출한다.
- 단순 CRUD는 Supabase 클라이언트(`src/lib/supabase.ts`)로 직접 접근한다 (RLS 전제).
- 기능 코드는 `src/features/<기능>/` 안에 모으고, 라우트 파일(`app/`)은 얇게 유지한다.
- 색상·간격·폰트는 `src/theme/` 토큰만 사용하고 하드코딩하지 않는다.
- 서버 API 명세는 teachme-server 레포 `docs/api-spec.md`를 따른다. 명세에 없는 엔드포인트는 임의로 만들지 말고 사용자에게 물어본다.
- 한국어로 소통하고, 코드와 식별자는 영어를 쓴다.

## 개발 규칙 (Git)
- main에는 직접 커밋/push하지 않는다. 모든 변경은 브랜치 → PR → 머지로 진행한다. (최초 뼈대 커밋만 예외)
- 브랜치는 항상 최신 main에서 따고, 이름은 feature/ fix/ chore/ docs/ 접두사 + 소문자 하이픈을 쓴다. (예: feature/auth)
- 한 브랜치는 한 기능만 다룬다. 범위를 벗어난 작업이 필요하면 멈추고 사용자에게 묻는다.
- 커밋은 Conventional Commits 형식으로 작은 단위로 나눠서 한다.
- 브랜치 push는 사용자가 요청했을 때만 한다. 커밋만 하고 push는 사용자의 지시를 기다린다.
- PR은 내가 요청했을 때만 만든다. PR 본문에는 변경 요약, 테스트 방법, 관련 화면/엔드포인트를 적는다.
- 머지는 Squash merge로 한다. 머지된 브랜치는 삭제하지 않고 그대로 둔다.
- 머지 후 다음 작업은 main을 pull한 뒤 새 브랜치에서 시작한다.

## 구조
- `app/` — expo-router 라우트: `(onboarding)`, `(tabs)`(홈/티치톡/MY), `lesson`
- `src/components/` 공용 컴포넌트, `src/features/` 기능별 코드, `src/hooks/`, `src/theme/`, `src/types/`
- `src/lib/` — `supabase.ts`(클라이언트), `api.ts`(Edge Function 호출 래퍼)
- `src/types/` — 서버 스키마를 옮긴 타입(`profile.ts`: Profile/StudyConcern/AiStudent, `school.ts`). 스키마는 teachme-server `docs/db-schema.md`를 따른다.
- import alias: `@/*` → `src/*`

## 인증·온보딩 흐름
- `src/features/auth/AuthProvider.tsx`가 세션과 profile 상태(`profileState`: loading/none/ready/error)를 들고 있다. profiles 행이 있으면 온보딩 완료로 본다. 온보딩 완료 후에는 `refreshProfile()`을 호출한다.
- 라우팅은 루트 `app/_layout.tsx`의 `Redirect` 한 곳에서만 결정한다 (`app/index.tsx`는 만들지 않는다).
  - 세션 없음 → login / 세션 있음 + profile 없음 → `(onboarding)` profile → school → concern → matched → welcome / profile 있음 → `(tabs)`
  - 네이티브 스플래시는 폰트·세션·profile 조회가 끝날 때까지 유지된다. profile이 있어도 `matched`/`welcome`은 온보딩을 마치도록 막지 않는다.
- 온보딩 중간 값은 `src/features/onboarding/OnboardingProvider.tsx`(메모리)에 두고, concern 단계에서 profiles에 한 번만 insert한다. 닉네임 중복(23505)이면 profile 단계로 돌려보낸다.
- concern → AI 학생 매핑은 `src/features/onboarding/constants.ts`의 `CONCERN_TO_STUDENT` 한 곳에만 둔다.
- 외부 호출(Supabase 테이블/RPC, Edge Function)은 `profileService.ts`, `schoolService.ts`를 통해서만 한다. Edge Function 에러는 `ApiError`(`status`, `code`)로 온다.

## 명령어
- `npx expo start` 개발 서버 / `npm run typecheck` 타입 검사 / `npm run lint`
- 패키지는 `npx expo install <pkg>`로 설치한다 (SDK 호환 버전 해결).
- Expo SDK는 변경이 잦으므로 API를 쓰기 전 `AGENTS.md`의 안내대로 버전별 공식 문서를 확인한다.

## 디자인 시스템
출처: Figma "TeachMe 개발" 파일의 디자인 시스템 노드(1:493). 화면은 다른 페이지에 있으며 여기서는 토큰/공통 컴포넌트만 다룬다.

**토큰 (`src/theme/`, `@/theme`에서 import)**
- `colors`: green 50~900(500=brand), neutral 0~800, semantic(success/warning/error/info + Bg), illustration(교실 팔레트), 역할 토큰 `bg`/`text`/`border`. 다크 역할 값은 `darkColors`에 있으나 컴포넌트는 아직 라이트만 사용.
- `typography`: displayLg/Md, heading1~3, title1~2, subtitle, body1~2, caption, micro. 굵기는 `fontFamily`에 포함되므로 `fontWeight`를 쓰지 않는다.
- `spacing`(4·8·12·16·20·24·32·40, 키=px), `layout`(screenMargin 20, cardGap 12, ctaHeight 56), `radius`(xs~3xl, full), `shadow`(none/e1/e2/brand).
- 폰트 로딩: `src/theme/fonts.ts`의 `fontAssets`를 `useAppFonts`(`src/hooks/`)가 로드하고, `app/_layout.tsx`에서 로딩이 끝날 때까지 스플래시를 유지한다.

**공통 컴포넌트 (`src/components/`)**: `Button`(variant primary/secondary/outline/text, size L/M, disabled·loading·fullWidth·leftIcon·rightIcon), `TextInput`(label, helperText, helperTone, error, disabled), `Checkbox`(약관 동의용). 그 외는 각 기능 브랜치에서 필요할 때 추가한다.

**못 옮긴 항목 / 확인 필요**
- **Paperlogy(display 폰트)**: display 토큰이 Bold(700)만 쓰므로 `Paperlogy-7Bold.ttf`만 로드한다(`assets/fonts/Paperlogy/`). 이 폴더에는 사용하는 파일만 둔다. display 토큰에 다른 굵기가 필요해지면 해당 파일을 추가하고 `fonts.ts`에 등록한다. 라이선스는 사용자가 파일을 제공한 것으로 갈음했으며 앱스토어 배포 전에 라이선스 조건 확인이 필요하다.
- Figma의 "Nanum Pen"은 Google Fonts의 Nanum Pen Script로 가정했다. 다른 폰트라면 알려줘야 한다.
- 다크 모드 컴포넌트 적용, Button의 S 크기·icon 버튼·Focus 링, TextInput의 leftIcon·clearable·에러 아이콘, Checkbox 외 선택 컨트롤(radio/switch/segmented), Chip/Badge, Card, Navigation, Feedback은 구현하지 않았다.
- Figma 변수/스타일이 아닌 프레임에 그려진 값이라 토큰이 아니다. 스케일에 없는 컴포넌트 고유 값(Button M 반경 14, Input 라벨 간격 6·테두리 1.5·높이 52, Checkbox 18)은 해당 컴포넌트 안의 상수로 두었다.
- 디자인 문서 내 불일치: Button M 라벨이 상태 표에서는 15, 크기 표에서는 14(코드는 15 = `subtitle` 사용). 흰 글자 on green.500은 대비 2.6:1(AA 미달)이라는 디자인 메모가 있으나 디자인대로 구현했다.
- 그림자는 CSS blur를 RN `shadowRadius`(blur/2)로 환산했고, Android는 `elevation` 근사값이다.

## 환경변수
`.env.example`을 `.env`로 복사해 사용. `EXPO_PUBLIC_*`는 앱 번들에 노출되므로 anon key만 둔다. service key 금지.
