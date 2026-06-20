import { IUser } from "@/server/models";

export const getMyUser = async (token: string | null) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body: { error?: string } | null = await response
      .json()
      .catch(() => null);
    throw new Error(body?.error);
  }

  const user: IUser = await response.json();
  return user;
};

export const saveUserIdentification = async (
  token: string | null,
  inquiryId: string,
) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inquiryId }),
  });

  if (!response.ok) {
    throw new Error("Failed to save identification");
  }
};
