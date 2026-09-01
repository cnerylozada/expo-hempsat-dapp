// Thrown by authenticated requests when the backend answers 401 with
// code: "TOKEN_EXPIRED", so callers can sign out instead of just showing the error.
export class TokenExpiredError extends Error {}

// Shared !response.ok handling for authenticated endpoints. The backend answers
// 401 { error, code: "TOKEN_EXPIRED" } once the JWT is dead, and only that code
// becomes a TokenExpiredError — everything else stays a plain Error, so a screen
// can tell "sign me out" apart from "show this message".
export const throwIfNotOk = async (
  response: Response,
  fallbackMessage?: string,
) => {
  if (response.ok) return;

  const body: { error?: string; code?: string } | null = await response
    .json()
    .catch(() => null);

  if (body?.code === "TOKEN_EXPIRED") throw new TokenExpiredError(body.error);
  throw new Error(body?.error ?? fallbackMessage);
};
