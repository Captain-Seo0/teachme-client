import { useCallback, useEffect, useState } from 'react';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';

import { SEARCH_DEBOUNCE_MS } from './constants';
import { validateNickname } from './nickname';
import { checkNicknameAvailable } from './profileService';

export type NicknameStatus =
  | { kind: 'idle' }
  | { kind: 'invalid'; message: string }
  | { kind: 'checking' }
  | { kind: 'available' }
  | { kind: 'taken' }
  | { kind: 'error'; message: string };

type Result =
  | { value: string; kind: 'available' | 'taken' }
  | { value: string; kind: 'error'; message: string };

/**
 * Validates the nickname format locally, then asks the server (debounced) whether it is free.
 * `retry` re-runs the check after a failure.
 */
export function useNicknameAvailability(nickname: string): {
  status: NicknameStatus;
  retry: () => void;
} {
  const debounced = useDebouncedValue(nickname, SEARCH_DEBOUNCE_MS);
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!debounced || validateNickname(debounced)) return;
    let cancelled = false;
    checkNicknameAvailable(debounced)
      .then((ok) => {
        if (!cancelled) setResult({ value: debounced, kind: ok ? 'available' : 'taken' });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : '닉네임을 확인하지 못했어요.';
        setResult({ value: debounced, kind: 'error', message });
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, attempt]);

  const retry = useCallback(() => {
    setResult(null);
    setAttempt((n) => n + 1);
  }, []);

  let status: NicknameStatus;
  const formatError = nickname ? validateNickname(nickname) : null;
  if (!nickname) status = { kind: 'idle' };
  else if (formatError) status = { kind: 'invalid', message: formatError };
  else if (result && result.value === nickname) status = result;
  else status = { kind: 'checking' };

  return { status, retry };
}
