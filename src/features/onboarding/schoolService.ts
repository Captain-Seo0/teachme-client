import { callFunction } from '@/lib/api';
import type { School } from '@/types/school';

/**
 * Searches schools via the `schools` Edge Function (api-spec.md). `q` must be 2~50 chars after trimming.
 * Throws ApiError on failure (e.g. 502 upstream_error / upstream_timeout).
 */
export async function searchSchools(q: string): Promise<School[]> {
  const data = await callFunction<{ schools: School[] }, { q: string }>('schools', { q: q.trim() });
  return data.schools ?? [];
}
