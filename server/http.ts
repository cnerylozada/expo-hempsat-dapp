export class TokenExpiredError extends Error {}

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
