import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from '@supabase/supabase-js';

import { supabase } from './supabase';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
    /** Server error code, e.g. "invalid_query" (from `{ error: { code, message } }`). */
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ErrorBody = { error?: { code?: string; message?: string } | string };

/**
 * Call a Supabase Edge Function. Throws ApiError on any failure.
 * Only call endpoints defined in teachme-server docs/api-spec.md.
 */
export async function callFunction<TResponse, TBody = unknown>(
  name: string,
  body?: TBody,
): Promise<TResponse> {
  const { data, error } = await supabase.functions.invoke<TResponse>(name, {
    body: body as Record<string, unknown> | undefined,
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const details: ErrorBody | undefined = await error.context.json().catch(() => undefined);
      const serverError = details?.error;
      const message =
        typeof serverError === 'string' ? serverError : (serverError?.message ?? error.message);
      const code = typeof serverError === 'object' ? serverError?.code : undefined;
      throw new ApiError(message, error.context.status, details, code);
    }
    if (error instanceof FunctionsRelayError || error instanceof FunctionsFetchError) {
      throw new ApiError(`Network error while calling "${name}"`, undefined, error);
    }
    throw new ApiError(error.message, undefined, error);
  }

  return data as TResponse;
}
