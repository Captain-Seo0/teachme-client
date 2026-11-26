import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from '@/lib/supabase';

import { AuthUiError, toAuthMessage } from './authErrors';

// Completes the auth session on web; a no-op on native.
WebBrowser.maybeCompleteAuthSession();

export type SocialProvider = 'kakao' | 'google';

export async function signInWithEmail(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new AuthUiError(toAuthMessage(error));
}

/** Resolves with `needsEmailConfirmation: true` when the project requires email verification. */
export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<{ needsEmailConfirmation: boolean }> {
  const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
  if (error) throw new AuthUiError(toAuthMessage(error));

  // With email confirmation on, Supabase hides existing accounts by returning a user
  // with no identities instead of an error.
  if (data.user && data.user.identities?.length === 0) {
    throw new AuthUiError('이미 가입된 이메일이에요.');
  }
  return { needsEmailConfirmation: !data.session };
}

/**
 * Social login via Supabase OAuth + system browser (Supabase's Expo guide).
 * Resolves 'cancelled' when the user closes the browser or denies consent.
 */
export async function signInWithSocial(provider: SocialProvider): Promise<'success' | 'cancelled'> {
  const redirectTo = Linking.createURL('/');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw new AuthUiError(toAuthMessage(error));

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') return 'cancelled';

  return createSessionFromUrl(result.url);
}

async function createSessionFromUrl(url: string): Promise<'success' | 'cancelled'> {
  const parsed = new URL(url);
  // Implicit flow returns tokens in the fragment; errors may be in the query or fragment.
  const params = new URLSearchParams(parsed.hash.replace(/^#/, ''));
  parsed.searchParams.forEach((value, key) => {
    if (!params.has(key)) params.set(key, value);
  });

  const errorCode = params.get('error_code') ?? params.get('error');
  if (errorCode) {
    if (errorCode === 'access_denied') return 'cancelled';
    throw new AuthUiError('소셜 로그인에 실패했어요. 잠시 후 다시 시도해 주세요.');
  }

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) {
    throw new AuthUiError('소셜 로그인에 실패했어요. 잠시 후 다시 시도해 주세요.');
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw new AuthUiError(toAuthMessage(error));
  return 'success';
}
