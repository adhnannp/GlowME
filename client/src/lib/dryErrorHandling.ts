export default function handleApiError(err: any, fallbackMessage: string): never {
    const message = err?.response?.data?.message || fallbackMessage;
    throw new Error(message);
}
  