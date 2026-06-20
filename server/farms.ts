import { IFarm } from "@/server/models";

export const getMyFarms = async (token: string | null) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/farms`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body: { error?: string } | null = await response
      .json()
      .catch(() => null);
    throw new Error(body?.error);
  }

  const farms: IFarm[] = await response.json();
  return farms;
};
