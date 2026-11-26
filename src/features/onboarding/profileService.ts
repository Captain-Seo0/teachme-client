import { supabase } from '@/lib/supabase';
import type { NewProfile, Profile } from '@/types/profile';

/** The chosen nickname is already taken (unique violation on lower(nickname)). */
export class NicknameTakenError extends Error {
  constructor() {
    super('이미 사용 중인 활동명이에요.');
    this.name = 'NicknameTakenError';
  }
}

/** Failure with a Korean message that is safe to show to the user. */
export class ProfileServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileServiceError';
  }
}

const NETWORK_MESSAGE = '네트워크 연결을 확인해 주세요.';
const GENERIC_MESSAGE = '문제가 생겼어요. 잠시 후 다시 시도해 주세요.';

function messageFor(error: { code?: string; message?: string }): string {
  if (/network|fetch/i.test(error.message ?? '')) return NETWORK_MESSAGE;
  if (error.code === '23514') return '입력한 정보를 다시 확인해 주세요.';
  return GENERIC_MESSAGE;
}

/** Returns the user's profile, or null when none exists yet (= onboarding not completed). */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new ProfileServiceError(messageFor(error));
  return data as Profile | null;
}

/** Calls the `is_nickname_available` RPC. */
export async function checkNicknameAvailable(nickname: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_nickname_available', { p_nickname: nickname });
  if (error) throw new ProfileServiceError(messageFor(error));
  return data === true;
}

/**
 * Inserts the profile in one shot at the end of onboarding.
 * Throws NicknameTakenError on a nickname unique violation (23505).
 */
export async function createProfile(userId: string, input: NewProfile): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...input })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      // A duplicate primary key means this user already has a profile (e.g. a repeated submit).
      if (/pkey|\(id\)/.test(`${error.message} ${error.details ?? ''}`)) {
        const existing = await fetchProfile(userId);
        if (existing) return existing;
      }
      throw new NicknameTakenError();
    }
    throw new ProfileServiceError(messageFor(error));
  }
  return data as Profile;
}
