import { throwIfNotOk } from "@/server/http";
import { IUser } from "@/server/models";

export const getMyUser = async (token: string | null) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  await throwIfNotOk(response);

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

  await throwIfNotOk(response, "Failed to save identification");
};
