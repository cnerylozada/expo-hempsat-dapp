import { throwIfNotOk } from "@/server/http";
import { CreateAreaInput, IFarmArea, IRawFarmArea } from "@/server/models";
import { appendPhotos } from "@/server/utils";

export const getAreasByFarmId = async (
  token: string | null,
  farmId: string,
) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/areas/${farmId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  await throwIfNotOk(response);

  const rawFarmAreaList: IRawFarmArea[] = await response.json();
  const farmAreaList: IFarmArea[] = rawFarmAreaList.map((rawFarmArea) => ({
    ...rawFarmArea,
    created_at: new Date(rawFarmArea.created_at),
  }));

  return farmAreaList.sort(
    (current, nextItem) =>
      nextItem.created_at.getTime() - current.created_at.getTime(),
  );
};

export const addNewAreaInFarm = async (
  token: string | null,
  farmId: string,
  areaBody: CreateAreaInput,
) => {
  const formData = new FormData();
  formData.append("name", areaBody.name);
  formData.append("description", areaBody.description);
  formData.append("tillagePractice", areaBody.tillagePractice);
  formData.append("currentCrop", areaBody.currentCrop);
  formData.append(
    "monthsUnderPractice",
    String(areaBody.yearsUnderPractice * 12 + areaBody.monthsUnderPractice),
  );
  formData.append("boundaries", JSON.stringify(areaBody.boundaries));
  formData.append("signature", areaBody.signature!);

  appendPhotos(formData, "images", areaBody.photoList, "area");

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/areas/${farmId}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  await throwIfNotOk(response);
};
