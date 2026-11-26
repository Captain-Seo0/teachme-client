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
- import alias: `@/*` → `src/*`

## 명령어
- `npx expo start` 개발 서버 / `npm run typecheck` 타입 검사 / `npm run lint`
- 패키지는 `npx expo install <pkg>`로 설치한다 (SDK 호환 버전 해결).
- Expo SDK는 변경이 잦으므로 API를 쓰기 전 `AGENTS.md`의 안내대로 버전별 공식 문서를 확인한다.

## 환경변수
`.env.example`을 `.env`로 복사해 사용. `EXPO_PUBLIC_*`는 앱 번들에 노출되므로 anon key만 둔다. service key 금지.
