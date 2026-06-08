import { IUser } from "@/app/(drawer)/dashboard/identification/_components/models";

export const getMyUser = async (token: string | null) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = await response.json();
  return user as IUser;
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
