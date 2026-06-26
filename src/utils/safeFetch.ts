export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

export const RETRYABLE_ERROR_NAMES = new Set(["AbortError", "FetchError"]);
export const RETRYABLE_CODES = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ENOTFOUND",
  "ECONNABORTED",
  "ECONNREFUSED",
]);

const MAX_RETRIES = 3;
export const TIMEOUT_MS = 5000;

function isRetryable(error: any, status?: number): boolean {
  if (status !== undefined && status >= 500) return true;
  if (error.status !== undefined && error.status >= 500) return true;
  if (error.name && RETRYABLE_ERROR_NAMES.has(error.name)) return true;
  const code = error.code ?? error.cause?.code;
  if (code && RETRYABLE_CODES.has(code)) return true;
  return false;
}

export async function safeFetch(url: string, fetchFn: FetchFn): Promise<any> {
  let lastError: any;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetchFn(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw Object.assign(new Error(`HTTP ${response.status}`), {
          status: response.status,
        });
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      lastError = error;

      if (isRetryable(error) && attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        continue;
      }
      break;
    }
  }

  throw lastError;
}
