import { throwIfNotOk } from "@/server/http";
import { IFarmArea, IRawFarmArea } from "@/server/models";

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
