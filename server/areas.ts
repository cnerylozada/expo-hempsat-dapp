import { throwIfNotOk } from "@/server/http";
import {
  CreateAreaInput,
  IAreaDetail,
  IAreaSummary,
  IRawAreaDetail,
  IRawAreaSummary,
} from "@/server/models";
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

  const rawFarmAreaList: IRawAreaSummary[] = await response.json();
  const farmAreaList: IAreaSummary[] = rawFarmAreaList.map((rawFarmArea) => ({
    ...rawFarmArea,
    createdAt: new Date(rawFarmArea.created_at),
  }));

  return farmAreaList.sort(
    (current, nextItem) =>
      nextItem.createdAt.getTime() - current.createdAt.getTime(),
  );
};

export const getAreaById = async (
  token: string | null,
  farmId: string,
  areaId: string,
) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/areas/${farmId}/${areaId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  await throwIfNotOk(response);

  const rawAreaDetail: IRawAreaDetail = await response.json();
  const areaDetail: IAreaDetail = {
    id: rawAreaDetail.id,
    name: rawAreaDetail.name,
    description: rawAreaDetail.description,
    boundaries: rawAreaDetail.boundaries,
    photos: rawAreaDetail.photos,
    tillagePractice: rawAreaDetail.tillage_practice,
    crop: rawAreaDetail.crop,
    monthsUnderPractice: rawAreaDetail.months_under_practice,
    attestationSignature: rawAreaDetail.attestation_signature,
    createdAt: new Date(rawAreaDetail.created_at),
  };
  return areaDetail;
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
  formData.append("crop", areaBody.crop);
  formData.append(
    "monthsUnderPractice",
    String(areaBody.yearsUnderPractice * 12 + areaBody.monthsUnderPractice),
  );
  formData.append("boundaries", JSON.stringify(areaBody.boundaries));
  formData.append("attestationSignature", areaBody.attestationSignature!);

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
