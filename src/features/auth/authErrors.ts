import { AuthError, isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js';

import { MIN_PASSWORD_LENGTH } from './constants';

/** An error whose message is safe to show to the user (already in Korean). */
export class AuthUiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthUiError';
  }
}

const GENERIC = '문제가 생겼어요. 잠시 후 다시 시도해 주세요.';

const byCode: Record<string, string> = {
  invalid_credentials: '이메일 또는 비밀번호가 올바르지 않아요.',
  email_not_confirmed: '이메일 인증이 필요해요. 메일함을 확인해 주세요.',
  user_already_exists: '이미 가입된 이메일이에요.',
  email_exists: '이미 가입된 이메일이에요.',
  weak_password: `비밀번호가 너무 약해요. ${MIN_PASSWORD_LENGTH}자 이상, 추측하기 어렵게 만들어 주세요.`,
  validation_failed: '입력한 내용을 다시 확인해 주세요.',
  email_address_invalid: '사용할 수 없는 이메일이에요.',
  signup_disabled: '지금은 회원가입을 할 수 없어요.',
  over_request_rate_limit: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.',
  over_email_send_rate_limit: '메일을 너무 자주 보냈어요. 잠시 후 다시 시도해 주세요.',
  user_banned: '이용이 제한된 계정이에요.',
};

/** Converts any thrown value from an auth call into a Korean, user-facing message. */
export function toAuthMessage(error: unknown): string {
  if (error instanceof AuthUiError) return error.message;
  if (isAuthRetryableFetchError(error)) return '네트워크 연결을 확인해 주세요.';
  if (isAuthApiError(error) || error instanceof AuthError) {
    const code = 'code' in error ? error.code : undefined;
    if (code && byCode[code]) return byCode[code];
    if (error.status === 429) return byCode.over_request_rate_limit;
  }
  if (error instanceof TypeError && /network/i.test(error.message)) {
    return '네트워크 연결을 확인해 주세요.';
  }
  return GENERIC;
}
