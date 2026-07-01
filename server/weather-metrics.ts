import { IForecast } from "@/server/models";
import { fetchWeatherApi } from "openmeteo";

const FORECAST_DAYS = 5;

export const fetchFiveDayForecast = async (
  latitude: number,
  longitude: number,
): Promise<IForecast[]> => {
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, {
    latitude,
    longitude,
    daily: ["temperature_2m_max", "temperature_2m_min", "weathercode"],
    forecast_days: FORECAST_DAYS,
  });

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const daily = response.daily()!;

  const maxTemps = daily.variables(0)!.valuesArray()!;
  const minTemps = daily.variables(1)!.valuesArray()!;
  const weatherCodes = daily.variables(2)!.valuesArray()!;

  return Array.from({ length: FORECAST_DAYS }, (_, i) => ({
    date: new Date(
      (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000,
    ),
    maxTemp: Math.round(maxTemps[i]),
    minTemp: Math.round(minTemps[i]),
    weatherCode: weatherCodes[i],
  }));
};
