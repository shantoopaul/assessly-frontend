import { type FetchError, type FetchOptions, ofetch } from "ofetch";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const baseFetch = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  onResponseError({ response }) {
    const message =
      (response._data as { message?: string } | undefined)?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  },
});

let refreshing: Promise<unknown> | null = null;

const refreshSession = () => {
  refreshing ??= baseFetch("/auth/refresh-token", {
    method: "POST",
    body: {},
  }).finally(() => {
    refreshing = null;
  });
  return refreshing;
};

async function apiClient<T>(
  request: string,
  options?: FetchOptions<"json">,
): Promise<T> {
  try {
    return await baseFetch<T>(request, options);
  } catch (error) {
    const canRefresh =
      error instanceof ApiError &&
      error.status === 401 &&
      !request.startsWith("/auth/");
    if (!canRefresh) throw error;

    await refreshSession().catch(() => {
      throw error;
    });
    return baseFetch<T>(request, options);
  }
}

export type ApiFetchError = FetchError;
export default apiClient;