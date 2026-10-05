import { type FetchError, ofetch } from "ofetch";

const apiClient = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  onResponseError({ response }) {
    const message =
      (response._data as { message?: string } | undefined)?.message ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  },
});

export type ApiFetchError = FetchError;
export default apiClient;
