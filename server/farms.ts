import { ICreateFarmInput, IFarm } from "@/server/models";

export const getMyFarmList = async (token: string | null) => {
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

  const farmList: IFarm[] = await response.json();
  return farmList;
};

export const getMyFarmById = async (token: string | null, id: string) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/farms/${id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    const body: { error?: string } | null = await response
      .json()
      .catch(() => null);
    throw new Error(body?.error);
  }

  const farm: IFarm = await response.json();
  return farm;
};

export const createFarm = async (
  token: string | null,
  farmBody: ICreateFarmInput,
) => {
  const formData = new FormData();
  formData.append("latitude", String(farmBody.location.latitude));
  formData.append("longitude", String(farmBody.location.longitude));

  farmBody.titleDeedPhotoList.forEach((photo, index) => {
    const extension = photo.uri.split(".").pop() ?? "jpg";
    formData.append("images", {
      uri: photo.uri,
      name: `title-deed-${index}.${extension}`,
      type: extension === "png" ? "image/png" : "image/jpeg",
    } as unknown as Blob);
  });

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/farms`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const body: { error?: string } | null = await response
      .json()
      .catch(() => null);
    throw new Error(body?.error);
  }
};
