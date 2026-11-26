import type { ImageSourcePropType } from 'react-native';

import { colors } from '@/theme';
import type { AiStudent, Grade, StudentType, StudyConcern } from '@/types/profile';

// Single source of truth for the concern -> first AI student mapping (db-schema.md `study_concern`).
export const CONCERN_TO_STUDENT: Record<StudyConcern, AiStudent> = {
  just_for_fun: 'dapdapi',
  cant_explain_terms: 'chorongi',
  confused_causality: 'ttokttogi',
  trips_on_tricky_questions: 'kkanjogi',
};

/** Concern choices in display order. Wording is copied from Figma 회원가입 4/4 (node 1:181). */
export const CONCERN_OPTIONS: { value: StudyConcern; label: string }[] = [
  { value: 'just_for_fun', label: '다 필요없고 재미가 최고에요' },
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

// All onboarding illustration paths live here (relative to this file).
export const ILLUSTRATIONS = {
  teacher: require('../../../assets/images/teacher.png') as ImageSourcePropType,
  /** Full welcome graphic: chalkboard with "오늘부터 나도 선생님!" and three student faces baked in. */
  chalkboard: require('../../../assets/images/chalkboard.png') as ImageSourcePropType,
  students: {
    dapdapi: require('../../../assets/images/dapdapi.png') as ImageSourcePropType,
    chorongi: require('../../../assets/images/chorongi.png') as ImageSourcePropType,
    ttokttogi: require('../../../assets/images/ttokttogi.png') as ImageSourcePropType,
    kkanjogi: require('../../../assets/images/kkanjogi.png') as ImageSourcePropType,
  } satisfies Record<AiStudent, ImageSourcePropType>,
};

// Default avatar colors stored in `profiles.avatar` (db-schema.md: mint / peach / sky / lemon).
export type AvatarId = 'mint' | 'peach' | 'sky' | 'lemon';
export const AVATAR_OPTIONS: { id: AvatarId; color: string }[] = [
  { id: 'mint', color: colors.green[100] },
  { id: 'peach', color: colors.illustration.skin },
  { id: 'sky', color: colors.semantic.infoBg },
  { id: 'lemon', color: colors.semantic.warningBg },
];
export const DEFAULT_AVATAR: AvatarId = 'mint';

/** Student type cards (Figma 회원가입 2/4). `schoolKind` filters search results; `hasGrade` shows the grade row. */
export const STUDENT_TYPE_OPTIONS: {
  value: StudentType;
  label: string;
  description: string;
  hasGrade: boolean;
  schoolKind: '중학교' | '고등학교' | null;
}[] = [
  { value: 'middle_school', label: '중학생', description: '중1 ~ 중3', hasGrade: true, schoolKind: '중학교' },
  { value: 'high_school', label: '고등학생', description: '고1 ~ 고3', hasGrade: true, schoolKind: '고등학교' },
  { value: 'repeat_exam_taker', label: 'N수생 · 대학생', description: '수능 · 전공 준비', hasGrade: false, schoolKind: null },
  { value: 'general', label: '일반인', description: '자격증 · 교양', hasGrade: false, schoolKind: null },
];

export const GRADES: Grade[] = [1, 2, 3];

// Limits from db-schema.md (`profiles.nickname`) and api-spec.md (`schools`).
export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 20;
export const SCHOOL_QUERY_MIN = 2;
export const SCHOOL_QUERY_MAX = 50;
export const SEARCH_DEBOUNCE_MS = 400;

// Profile photo: stored at avatars/{user_id}/avatar.jpg as a 512 x 512 JPEG (db-schema.md Storage).
export const AVATAR_BUCKET = 'avatars';
export const AVATAR_FILE_NAME = 'avatar.jpg';
export const AVATAR_PHOTO_SIZE = 512;
export const AVATAR_JPEG_QUALITY = 0.85;

// Onboarding screens a signed-in user without a profile may stay on.
export const PROFILE_FLOW_SCREENS = ['profile', 'school', 'concern'] as const;
