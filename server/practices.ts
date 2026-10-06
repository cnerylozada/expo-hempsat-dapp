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

  const MOCK_PRACTICES: IPracticeSummary[] = [
    {
      id: "5d7b1c0e-1a43-4c52-9f0a-6a1f2b9c0001",
      type: "mulching",
      crop: "hemp",
      started_at: "2026-09-15",
      finished_at: null,
      tillage_practice: "no_till",
      createdAt: new Date("2026-09-15T14:20:00Z"),
    },
    {
      id: "5d7b1c0e-1a43-4c52-9f0a-6a1f2b9c0002",
      type: "cover_crops",
      crop: "fallow",
      started_at: "2026-03-10",
      finished_at: "2026-08-30",
      tillage_practice: "reduced",
      createdAt: new Date("2026-03-10T09:05:00Z"),
    },
    {
      id: "5d7b1c0e-1a43-4c52-9f0a-6a1f2b9c0003",
      type: "organic_amendments",
      crop: "maize",
      started_at: "2025-09-01",
      finished_at: "2026-02-20",
      tillage_practice: "conventional",
      createdAt: new Date("2025-09-01T16:40:00Z"),
    },
    {
      id: "5d7b1c0e-1a43-4c52-9f0a-6a1f2b9c0004",
      type: "mulching",
      crop: "quinoa",
      started_at: "2025-02-12",
      finished_at: "2025-07-28",
      tillage_practice: "native_fallow",
      createdAt: new Date("2025-02-12T11:15:00Z"),
    },
  ];

  // return practiceList.sort(
  //   (current, nextItem) =>
  //     nextItem.createdAt.getTime() - current.createdAt.getTime(),
  // );
  return MOCK_PRACTICES;
};
