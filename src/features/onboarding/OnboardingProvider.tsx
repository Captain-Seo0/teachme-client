import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { Grade, Profile, StudentType, StudyConcern } from '@/types/profile';
import type { SelectedSchool } from '@/types/school';

import { useAuth } from '../auth/AuthProvider';
import { uploadAvatar } from './avatarService';
import { CONCERN_TO_STUDENT, DEFAULT_AVATAR, STUDENT_TYPE_OPTIONS, type AvatarId } from './constants';
import { getSocialNickname } from './nickname';
import { createProfile } from './profileService';

/** Values collected across the onboarding screens. Kept in memory until the final insert. */
export type OnboardingDraft = {
  nickname: string;
  avatar: AvatarId;
  /** Local uri of the chosen (already 512px JPEG) photo. Null = use the `avatar` color. */
  avatarPhotoUri: string | null;
  studentType: StudentType | null;
  /** Null when skipped (repeat_exam_taker / general) or not chosen yet. */
  school: SelectedSchool | null;
  /** Only used for middle_school / high_school. */
  grade: Grade | null;
  concern: StudyConcern | null;
  /** One-off message for the profile screen (e.g. the nickname was taken at submit time). */
  notice: string | null;
  /** One-off message for the welcome screen when the photo upload failed. */
  avatarNotice: string | null;
};

type OnboardingContextValue = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  /**
   * Uploads the photo (if any), inserts the profiles row once, then refreshes the profile state.
   * A failed upload does not block sign-up: avatar_url stays null and `avatarNotice` is set.
   * Throws NicknameTakenError / ProfileServiceError.
   */
  submit: () => Promise<Profile>;
};

const AVATAR_UPLOAD_FAILED = '프로필 사진을 올리지 못했어요. 기본 색 아바타로 시작할게요.';

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { session, refreshProfile } = useAuth();

  const [draft, setDraft] = useState<OnboardingDraft>({
    nickname: '',
    avatar: DEFAULT_AVATAR,
    avatarPhotoUri: null,
    studentType: null,
    school: null,
    grade: null,
    concern: null,
    notice: null,
    avatarNotice: null,
  });

  // This provider lives in the (onboarding) group, which is mounted before sign-in. Once a user
  // signs in, prefill the nickname from their social profile (e.g. Kakao) once; it stays editable.
  const prefilledFor = useRef<string | null>(null);
  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!session || prefilledFor.current === session.user.id) return;
    prefilledFor.current = session.user.id;
    const suggested = getSocialNickname(session.user);
    if (suggested) setDraft((prev) => (prev.nickname ? prev : { ...prev, nickname: suggested }));
  }, [session, userId]);

  const update = useCallback((patch: Partial<OnboardingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const submit = useCallback(async () => {
    const id = session?.user.id;
    const { nickname, avatar, avatarPhotoUri, studentType, school, grade, concern } = draft;
    const hasGrade = STUDENT_TYPE_OPTIONS.find((o) => o.value === studentType)?.hasGrade ?? false;
    if (!id || !studentType || !concern || (hasGrade && (!grade || !school))) {
      throw new Error('Onboarding draft is incomplete');
    }

    // Order: upload (if there is a photo) -> insert. An upload failure never blocks sign-up.
    let avatarUrl: string | null = null;
    let uploadFailed = false;
    if (avatarPhotoUri) {
      try {
        avatarUrl = await uploadAvatar(id, avatarPhotoUri);
      } catch {
        uploadFailed = true;
      }
    }

    const profile = await createProfile(id, {
      nickname,
      avatar,
      avatar_url: avatarUrl,
      student_type: studentType,
      school_name: school?.school_name ?? null,
      school_code: school?.school_code ?? null,
      school_kind: school?.school_kind ?? null,
      grade: hasGrade ? grade : null,
      study_concern: concern,
      matched_student: CONCERN_TO_STUDENT[concern],
    });

    if (uploadFailed) setDraft((prev) => ({ ...prev, avatarNotice: AVATAR_UPLOAD_FAILED }));
    await refreshProfile();
    return profile;
  }, [session, draft, refreshProfile]);

  const value = useMemo(() => ({ draft, update, submit }), [draft, update, submit]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside <OnboardingProvider>');
  return ctx;
}
