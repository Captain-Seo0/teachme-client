import { colors } from '@/theme';
import type { AiStudent, Grade, StudyConcern } from '@/types/profile';

// Single source of truth for the concern -> first AI student mapping (db-schema.md `study_concern`).
export const CONCERN_TO_STUDENT: Record<StudyConcern, AiStudent> = {
  just_for_fun: 'dapdapi',
  cant_explain_terms: 'chorongi',
  confused_causality: 'ttokttogi',
  trips_on_tricky_questions: 'kkanjogi',
};

/** Concern choices in display order (Figma 회원가입 4/4). */
export const CONCERN_OPTIONS: { value: StudyConcern; label: string }[] = [
  { value: 'just_for_fun', label: '다 필요 없고 재미가 최고예요' },
  { value: 'cant_explain_terms', label: '용어는 외웠는데 설명이 안 돼요' },
  { value: 'confused_causality', label: '개념은 아는데 인과관계가 헷갈려요' },
  { value: 'trips_on_tricky_questions', label: '응용·함정 문제만 나오면 틀려요' },
];

export const STUDENT_INFO: Record<AiStudent, { name: string; description: string }> = {
  dapdapi: { name: '답답이', description: '잘 모르겠다며 끊임없이 질문하는 학생' },
  chorongi: { name: '초롱이', description: '호기심 많고 리액션이 풍부한 초보 학생' },
  ttokttogi: { name: '똑똑이', description: '이해가 빠르고 눈치가 백 단인 우등생' },
  kkanjogi: { name: '깐족이', description: '장난기 있지만 핵심을 찌르는 반항아 천재' },
};

// Avatar identifiers stored in `profiles.avatar`. The schema only requires 1~50 chars;
// these ids and colors are the 4 color choices from Figma 회원가입 1/4.
export type AvatarId = 'mint' | 'peach' | 'sky' | 'lemon';
export const AVATAR_OPTIONS: { id: AvatarId; color: string }[] = [
  { id: 'mint', color: colors.green[100] },
  { id: 'peach', color: colors.illustration.skin },
  { id: 'sky', color: colors.semantic.infoBg },
  { id: 'lemon', color: colors.semantic.warningBg },
];
export const DEFAULT_AVATAR: AvatarId = 'mint';

export const GRADES: Grade[] = [1, 2, 3];

// Limits from db-schema.md (`profiles.nickname`) and api-spec.md (`schools`).
export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 20;
export const SCHOOL_QUERY_MIN = 2;
export const SCHOOL_QUERY_MAX = 50;
export const SEARCH_DEBOUNCE_MS = 400;

// Onboarding screens a signed-in user without a profile may stay on.
export const PROFILE_FLOW_SCREENS = ['profile', 'school', 'concern'] as const;
