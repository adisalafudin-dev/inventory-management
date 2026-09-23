export function getErrorMessage(
  error: any,
  fallback = "Terjadi kesalahan",
): string {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message[0];
  if (typeof message === "string") return message;
  return fallback;
}
