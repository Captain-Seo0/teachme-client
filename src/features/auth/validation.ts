import { MIN_PASSWORD_LENGTH } from './constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a Korean error message, or null when valid. */
export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return '이메일을 입력해 주세요.';
  if (!EMAIL_PATTERN.test(email)) return '올바른 이메일 형식이 아니에요.';
  return null;
}

/** Returns a Korean error message, or null when valid. */
export function validatePassword(value: string): string | null {
  if (!value) return '비밀번호를 입력해 주세요.';
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 해요.`;
  }
  return null;
}
