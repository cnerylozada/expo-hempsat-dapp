import { throwIfNotOk } from "@/server/http";
import { CreateFarmInput, IFarm, IRawFarm } from "@/server/models";
import { appendPhotos } from "@/server/utils";

export const getMyFarmList = async (token: string | null) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/farms`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  await throwIfNotOk(response);

  const rawFarmList: IRawFarm[] = await response.json();
  const farmList: IFarm[] = rawFarmList.map((farm) => ({
    ...farm,
    createdAt: new Date(farm.created_at),
    parcelId: farm.parcel_id,
  }));

  return farmList.sort(
    (current, nextItem) =>
      nextItem.createdAt.getTime() - current.createdAt.getTime(),
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

  const rawFarm: IRawFarm = await response.json();
  const farm: IFarm = {
    ...rawFarm,
    createdAt: new Date(rawFarm.created_at),
    parcelId: rawFarm.parcel_id,
  };
  return farm;
};

export const createFarm = async (
  token: string | null,
  farmBody: CreateFarmInput,
) => {
  const formData = new FormData();
  formData.append("name", String(farmBody.name));
  formData.append("boundaries", JSON.stringify(farmBody.boundaries));

  appendPhotos(formData, "images", farmBody.titleDeedPhotoList, "title-deed");

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/farms`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  await throwIfNotOk(response);
};
