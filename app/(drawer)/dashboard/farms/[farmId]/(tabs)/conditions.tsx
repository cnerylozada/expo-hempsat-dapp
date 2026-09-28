import { useAuthedQuery } from "@/components/authedRequests";
import { WeatherForecastCard } from "@/components/farms/WeatherForecastCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { StatusBanner } from "@/components/shared/StatusBanner";
import { polygonCenter } from "@/components/shared/utils";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyFarmById } from "@/server/farms";
import { fetchFiveDayForecast } from "@/server/weather-metrics";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { View } from "react-native";

export default function FarmConditions() {
  const { farmId } = useGlobalSearchParams<{ farmId: string }>();
  const { token } = useAuth();

  const {
    data: farm,
    isLoading: isFarmLoading,
    isError: isFarmError,
    error: farmError,
    refetch: refetchFarm,
    isRefetching: isFarmRefetching,
  } = useAuthedQuery(queryKeys.farms.farmById(farmId), () =>
    getMyFarmById(token, farmId),
  );

  const center = farm ? polygonCenter(farm.boundaries) : null;

  const {
    data: forecast,
    isLoading: isForecastLoading,
    isError: isForecastError,
    error: forecastError,
    refetch: refetchForecast,
    isRefetching: isForecastRefetching,
  } = useQuery({
    queryKey: queryKeys.weather.forecast,
    queryFn: () => {
      if (!center) throw new Error("Farm not found");
      return fetchFiveDayForecast(center.latitude, center.longitude);
    },
    enabled: !!center,
  });

  if (
    isFarmLoading ||
    isFarmRefetching ||
    isForecastLoading ||
    isForecastRefetching
  )
    return <LoadingScreen />;

  return (
    <View className="flex-1 gap-3">
      <SectionTitle title="5-day forecast" icon="partly-sunny-outline" />

      {isFarmError && (
        <StatusBanner
          theme="error"
          title="Something went wrong"
          description={farmError.message}
          action={{
            icon: "refresh",
            label: "Retry",
            onPress: () => refetchFarm(),
          }}
        />
      )}
      {isForecastError ? (
        <StatusBanner
          theme="error"
          title="Could not load forecast"
          description={forecastError.message}
          action={{
            icon: "refresh",
            label: "Retry",
            onPress: () => refetchForecast(),
          }}
        />
      ) : (
        forecast && <WeatherForecastCard forecastList={forecast} />
      )}
    </View>
  );
}
