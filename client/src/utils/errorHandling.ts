import { AxiosError } from "axios";

export function handleApiError(err: AxiosError | Error, fallbackMessage: string): Error {
  console.error(fallbackMessage, err);
  const message =
    err instanceof AxiosError && err.response?.data?.message
      ? err.response.data.message
      : fallbackMessage;
  return new Error(message);
}