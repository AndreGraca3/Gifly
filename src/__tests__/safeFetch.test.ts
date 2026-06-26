import { safeFetch, FetchFn, RETRYABLE_CODES, RETRYABLE_ERROR_NAMES, TIMEOUT_MS } from "../utils/safeFetch";

jest.useFakeTimers();

function makeResponse(body: any, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

function makeFetchMock(responses: Array<() => Promise<Response>>): FetchFn {
  let call = 0;
  return jest.fn((_url, _init) =>
    responses[Math.min(call++, responses.length - 1)]()
  ) as unknown as FetchFn;
}

function networkError(code: string): Error {
  const err = new Error(`connect ${code}`) as any;
  err.code = code;
  return err;
}

function nestedNetworkError(code: string): Error {
  const err = new Error(`connect ${code}`) as any;
  err.cause = { code };
  return err;
}

function abortError(): Error {
  const err = new Error("The operation was aborted") as any;
  err.name = "AbortError";
  return err;
}

describe("safeFetch", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns data on first successful attempt", async () => {
    const fetchMock = makeFetchMock([
      () => Promise.resolve(makeResponse({ gifs: [] })),
    ]);
    const result = await safeFetch("https://example.com", fetchMock);
    expect(result).toEqual({ gifs: [] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries on ETIMEDOUT and succeeds on second attempt", async () => {
    const fetchMock = makeFetchMock([
      () => Promise.reject(networkError("ETIMEDOUT")),
      () => Promise.resolve(makeResponse({ gifs: ["a"] })),
    ]);

    const promise = safeFetch("https://example.com", fetchMock);
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ gifs: ["a"] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries on ECONNRESET and succeeds on third attempt", async () => {
    const fetchMock = makeFetchMock([
      () => Promise.reject(networkError("ECONNRESET")),
      () => Promise.reject(networkError("ECONNRESET")),
      () => Promise.resolve(makeResponse({ ok: true })),
    ]);

    const promise = safeFetch("https://example.com", fetchMock);
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("retries when error code is nested in error.cause", async () => {
    const fetchMock = makeFetchMock([
      () => Promise.reject(nestedNetworkError("ETIMEDOUT")),
      () => Promise.resolve(makeResponse({ nested: true })),
    ]);

    const promise = safeFetch("https://example.com", fetchMock);
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ nested: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries on AbortError (timeout) and succeeds", async () => {
    const fetchMock = makeFetchMock([
      () => Promise.reject(abortError()),
      () => Promise.resolve(makeResponse({ recovered: true })),
    ]);

    const promise = safeFetch("https://example.com", fetchMock);
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ recovered: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries on 500 server error and succeeds", async () => {
    const fetchMock = makeFetchMock([
      () => Promise.resolve(makeResponse({}, 500)),
      () => Promise.resolve(makeResponse({ recovered: true })),
    ]);

    const promise = safeFetch("https://example.com", fetchMock);
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ recovered: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting all 3 retries", async () => {
    const fetchMock = makeFetchMock([
      () => Promise.reject(networkError("ETIMEDOUT")),
      () => Promise.reject(networkError("ETIMEDOUT")),
      () => Promise.reject(networkError("ETIMEDOUT")),
    ]);

    const promise = safeFetch("https://example.com", fetchMock);
    const assertion = expect(promise).rejects.toMatchObject({ code: "ETIMEDOUT" });
    await jest.runAllTimersAsync();
    await assertion;

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does NOT retry on 4xx client errors", async () => {
    const fetchMock = makeFetchMock([
      () => Promise.resolve(makeResponse({}, 404)),
    ]);

    await expect(safeFetch("https://example.com", fetchMock)).rejects.toMatchObject({
      status: 404,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("covers all RETRYABLE_CODES", () => {
    expect(RETRYABLE_CODES).toContain("ETIMEDOUT");
    expect(RETRYABLE_CODES).toContain("ECONNRESET");
    expect(RETRYABLE_CODES).toContain("ENOTFOUND");
    expect(RETRYABLE_CODES).toContain("ECONNABORTED");
    expect(RETRYABLE_CODES).toContain("ECONNREFUSED");
  });

  it("covers AbortError in RETRYABLE_ERROR_NAMES", () => {
    expect(RETRYABLE_ERROR_NAMES).toContain("AbortError");
  });

  it("passes timeout signal to fetchFn", async () => {
    const fetchMock = jest.fn((_url: string, init?: RequestInit) => {
      expect(init?.signal).toBeDefined();
      return Promise.resolve(makeResponse({ ok: true }));
    }) as unknown as FetchFn;

    await safeFetch("https://example.com", fetchMock);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
