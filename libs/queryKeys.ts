export const queryKeys = {
  farms: {
    myFarms: ["farms"] as const,
    farmById: (id: string) => ["farms", id] as const,
  },
  areas: {
    byFarmId: (farmId: string) => ["areas", farmId] as const,
  },
  users: {
    myUser: ["users", "me"] as const,
  },
  weather: {
    forecast: ["weather", "forecast"] as const,
  },
};
