import type { User } from '@supabase/supabase-js';

import { NICKNAME_MAX, NICKNAME_MIN } from './constants';

const length = (value: string) => Array.from(value).length;

/** Format check from db-schema.md: 2~20 chars, no leading/trailing spaces. Returns a Korean message or null. */
export function validateNickname(value: string): string | null {
  if (value !== value.trim()) return '앞뒤 공백은 쓸 수 없어요.';
  if (length(value) < NICKNAME_MIN) return `${NICKNAME_MIN}자 이상 입력해 주세요.`;
  if (length(value) > NICKNAME_MAX) return `${NICKNAME_MAX}자 이하로 입력해 주세요.`;
  return null;
}

/** Nickname-like default supplied by a social provider (e.g. Kakao), or '' when none/unusable. */
export function getSocialNickname(user: User | null | undefined): string {
  if (!user || !user.app_metadata?.provider || user.app_metadata.provider === 'email') return '';

  const meta = user.user_metadata ?? {};
  const candidate = [meta.nickname, meta.user_name, meta.preferred_username, meta.name, meta.full_name].find(
    (v): v is string => typeof v === 'string' && v.trim().length > 0,
  );
  if (!candidate) return '';

  const trimmed = Array.from(candidate.trim()).slice(0, NICKNAME_MAX).join('').trim();
  return validateNickname(trimmed) === null ? trimmed : '';
}
