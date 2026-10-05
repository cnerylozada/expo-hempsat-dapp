import { throwIfNotOk } from "@/server/http";
import { IPracticeSummary, IRawPracticeSummary } from "@/server/models";

export const getPracticesByAreaId = async (
  token: string | null,
  areaId: string,
) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/practices/${areaId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  await throwIfNotOk(response);

  const rawPracticeList: IRawPracticeSummary[] = await response.json();
  const practiceList: IPracticeSummary[] = rawPracticeList.map(
    (rawFarmArea) => ({
      ...rawFarmArea,
      createdAt: new Date(rawFarmArea.created_at),
    }),
  );

  return practiceList.sort(
    (current, nextItem) =>
      nextItem.createdAt.getTime() - current.createdAt.getTime(),
  );
};
