export const signIn = async (requestBody: {
  wallet: string;
  message: string;
  signature: string;
}) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/sign-in`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const body: { error?: string } | null = await response
      .json()
      .catch(() => null);
    throw new Error(body?.error ?? "Sign-in failed");
  }

  const { token } = await response.json();
  return token as string;
};

export const signOut = async (token: string | null) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/sign-out`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    const body: { error?: string } | null = await response
      .json()
      .catch(() => null);
    throw new Error(body?.error ?? "Sign-out failed");
  }
};

export const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
