import { WeatherForecastCard } from "@/components/farms/WeatherForecastCard";
import { ThemedText } from "@/components/ThemedText";
import { fetchFiveDayForecast } from "@/server/weather-metrics";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";

export default function FarmById() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["asd"],
    queryFn: () => fetchFiveDayForecast(-12.110105, -77.013819),
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {isError && (
        <View>
          <ThemedText className="dark:text-text-danger-dark">
            Something went wrong: {error.message}
          </ThemedText>
        </View>
      )}
      {!isError && data && <WeatherForecastCard forecastList={data} />}
    </View>
  );
}
