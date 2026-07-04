import { WeatherForecastCard } from "@/components/farms/WeatherForecastCard";
import { ThemedText } from "@/components/ThemedText";
import { queryKeys } from "@/libs/queryKeys";
import { getMyFarmById } from "@/server/farms";
import { fetchFiveDayForecast } from "@/server/weather-metrics";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";

export default function FarmById() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: farm,
    isLoading: isFarmLoading,
    isError: isFarmError,
    error: farmError,
  } = useQuery({
    queryKey: queryKeys.farms.farmById(id),
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("jwt");
      return getMyFarmById(token, id);
    },
  });

  const {
    data: forecast,
    isLoading: isForecastLoading,
    isError: isForecastError,
    error: forecastError,
  } = useQuery({
    queryKey: queryKeys.weather.forecast,
    queryFn: () => {
      if (!farm) throw new Error("Farm not found");
      return fetchFiveDayForecast(farm.latitude, farm.longitude);
    },
    enabled: !!farm,
  });

  if (isFarmLoading || isForecastLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: farm?.location ?? id }} />
      {isFarmError && (
        <ThemedText className="dark:text-text-danger-dark">
          Something went wrong: {farmError.message}
        </ThemedText>
      )}
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
