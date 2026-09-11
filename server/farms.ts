import { throwIfNotOk } from "@/server/http";
import { CreateFarmInput, IFarm } from "@/server/models";

export const getMyFarmList = async (token: string | null) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/farms`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  await throwIfNotOk(response);

  const farmList: IFarm[] = await response.json();
  return farmList.sort(
    (current, nextItem) =>
      new Date(nextItem.created_at).getTime() -
      new Date(current.created_at).getTime(),
  );
};

export const getMyFarmById = async (token: string | null, id: string) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/farms/${id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  await throwIfNotOk(response);

  const farm: IFarm = await response.json();
  return farm;
};

export const createFarm = async (
  token: string | null,
  farmBody: CreateFarmInput,
) => {
  const formData = new FormData();
  formData.append("name", String(farmBody.name));
  formData.append("boundaries", JSON.stringify(farmBody.boundaries));

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

  await throwIfNotOk(response);
};
