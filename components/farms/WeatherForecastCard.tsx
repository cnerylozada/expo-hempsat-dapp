import { IForecast } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { getDayLabel, getWeatherInfo } from "./utils";

export const WeatherForecastCard = ({
  forecastList,
}: {
  forecastList: IForecast[];
}) => {
  return (
    <View className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 gap-4">
      <View className="flex-row items-center gap-1">
        <Ionicons name="sunny-outline" size={24} color="white" />
        <ThemedText type="subtitle">Weather</ThemedText>
      </View>

      <View className="gap-4">
        {(() => {
          const currentDay = forecastList[0];
          const weatherInfo = getWeatherInfo(currentDay.weatherCode);
          return (
            <View className="flex-row">
              <View className="flex-row gap-4">
                <View className="gap-1 items-center">
                  <Ionicons name={weatherInfo.icon} size={40} color="white" />
                  <View className="flex-row items-center">
                    <ThemedText>{currentDay.maxTemp}° / </ThemedText>
                    <ThemedText>{currentDay.minTemp}°</ThemedText>
                  </View>
                </View>

                <View>
                  <ThemedText type="defaultSemiBold">Today</ThemedText>
                  <ThemedText type="subtext">{weatherInfo.label}</ThemedText>
                  <ThemedText type="subtext">
                    Humidity {currentDay.humidity}%
                  </ThemedText>
                </View>
              </View>
            </View>
          );
        })()}

        <View className="flex-row justify-between">
          {forecastList.slice(1).map((_, index) => {
            const weather = getWeatherInfo(_.weatherCode);
            return (
              <View key={index} className="items-center gap-1">
                <ThemedText type="subtext">
                  {getDayLabel(_.date, index + 1)}
                </ThemedText>
                <Ionicons name={weather.icon} size={28} color="white" />
                <View className="flex-row items-center">
                  <ThemedText>{_.maxTemp}° / </ThemedText>
                  <ThemedText>{_.minTemp}°</ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
