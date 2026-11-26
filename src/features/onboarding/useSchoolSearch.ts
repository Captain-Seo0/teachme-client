import { useEffect, useState } from 'react';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { School } from '@/types/school';

import { SCHOOL_QUERY_MIN, SEARCH_DEBOUNCE_MS } from './constants';
import { searchSchools } from './schoolService';

export type SchoolSearchState =
  | { kind: 'idle' } // query shorter than the minimum
  | { kind: 'loading' }
  | { kind: 'results'; schools: School[] }
  | { kind: 'empty' } // searched, nothing found
  | { kind: 'error' }; // search failed (e.g. 502) - manual entry is allowed

type Result = { q: string; schools: School[] | null };

/** Debounced school search; only queries once the trimmed text has at least 2 characters. */
export function useSchoolSearch(query: string): SchoolSearchState {
  const q = query.trim();
  const debounced = useDebouncedValue(q, SEARCH_DEBOUNCE_MS);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (debounced.length < SCHOOL_QUERY_MIN) return;
    let cancelled = false;
    searchSchools(debounced)
      .then((schools) => {
        if (!cancelled) setResult({ q: debounced, schools });
      })
      .catch(() => {
        if (!cancelled) setResult({ q: debounced, schools: null });
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  if (q.length < SCHOOL_QUERY_MIN) return { kind: 'idle' };
  if (!result || result.q !== q) return { kind: 'loading' };
  if (!result.schools) return { kind: 'error' };
  return result.schools.length > 0 ? { kind: 'results', schools: result.schools } : { kind: 'empty' };
}
