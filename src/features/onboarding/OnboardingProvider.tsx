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

import type { Grade, Profile, StudyConcern } from '@/types/profile';
import type { SelectedSchool } from '@/types/school';

import { useAuth } from '../auth/AuthProvider';
import { CONCERN_TO_STUDENT, DEFAULT_AVATAR, type AvatarId } from './constants';
import { getSocialNickname } from './nickname';
import { createProfile } from './profileService';

/** Values collected across the onboarding screens. Kept in memory until the final insert. */
export type OnboardingDraft = {
  nickname: string;
  avatar: AvatarId;
  school: SelectedSchool | null;
  grade: Grade | null;
  concern: StudyConcern | null;
  /** One-off message for the profile screen (e.g. the nickname was taken at submit time). */
  notice: string | null;
};

type OnboardingContextValue = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
  /**
   * Inserts the profiles row once, then refreshes the profile state.
   * Throws NicknameTakenError / ProfileServiceError.
   */
  submit: () => Promise<Profile>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { session, refreshProfile } = useAuth();

  const [draft, setDraft] = useState<OnboardingDraft>({
    nickname: '',
    avatar: DEFAULT_AVATAR,
    school: null,
    grade: null,
    concern: null,
    notice: null,
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
    const userId = session?.user.id;
    const { nickname, avatar, school, grade, concern } = draft;
    if (!userId || !school || !grade || !concern) {
      throw new Error('Onboarding draft is incomplete');
    }

    const profile = await createProfile(userId, {
      nickname,
      avatar,
      school_name: school.school_name,
      school_code: school.school_code,
      school_kind: school.school_kind,
      grade,
      study_concern: concern,
      matched_student: CONCERN_TO_STUDENT[concern],
    });
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
