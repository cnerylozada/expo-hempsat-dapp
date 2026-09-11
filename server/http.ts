export class TokenExpiredError extends Error {}

export const throwIfNotOk = async (
  response: Response,
  fallbackMessage?: string,
) => {
  if (response.ok) return;

  const body: { error?: unknown; code?: string } | null = await response
    .json()
    .catch(() => null);

  // `error` is a plain string for most failures, but a field-keyed object
  // (e.g. `{ boundaries: ["..."] }`) for validation errors — passing that
  // straight to `Error()` stringifies it to "[object Object]". Stringify it
  // ourselves when it isn't already a string.
  const message =
    typeof body?.error === "string" ? body.error : JSON.stringify(body?.error);

  if (body?.code === "TOKEN_EXPIRED") throw new TokenExpiredError(message);
  console.log("body?.error", body?.error);
  throw new Error(message ?? fallbackMessage);
};
