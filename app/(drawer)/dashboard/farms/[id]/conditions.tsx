import { WeatherForecastCard } from "@/components/farms/WeatherForecastCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ThemedText } from "@/components/ThemedText";
import { queryKeys } from "@/libs/queryKeys";
import { IFarm } from "@/server/models";
import { fetchFiveDayForecast } from "@/server/weather-metrics";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

export default function FarmConditions() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const farm = queryClient.getQueryData<IFarm>(queryKeys.farms.farmById(id));

  const {
    data: forecast,
    isLoading: isForecastLoading,
    isError: isForecastError,
    error: forecastError,
  } = useQuery({
    queryKey: queryKeys.weather.forecast,
    queryFn: () => {
      if (!farm) throw new Error("Farm not found");
      return fetchFiveDayForecast(
        farm.location.latitude,
        farm.location.longitude,
      );
    },
    enabled: !!farm,
  });

  if (isForecastLoading) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1">
      {isForecastError && (
        <ThemedText className="dark:text-text-danger-dark">
          Could not load forecast: {forecastError.message}
        </ThemedText>
      )}
      {!isForecastError && forecast && (
        <WeatherForecastCard forecastList={forecast} />
      )}
    </View>
  );
}
