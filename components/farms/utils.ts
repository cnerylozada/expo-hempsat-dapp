import Ionicons from "@expo/vector-icons/Ionicons";

type WeatherIconName = React.ComponentProps<typeof Ionicons>["name"];
type WeatherInfo = { icon: WeatherIconName; label: string };

const WMO_WEATHER: Record<number, WeatherInfo> = {
  0: { icon: "sunny-outline", label: "Clear sky" },
  1: { icon: "sunny-outline", label: "Mainly clear" },
  2: { icon: "partly-sunny-outline", label: "Partly cloudy" },
  3: { icon: "cloudy-outline", label: "Overcast" },
  45: { icon: "cloud-outline", label: "Fog" },
  48: { icon: "cloud-outline", label: "Rime fog" },
  51: { icon: "water-outline", label: "Light drizzle" },
  53: { icon: "water-outline", label: "Moderate drizzle" },
  55: { icon: "water-outline", label: "Dense drizzle" },
  56: { icon: "rainy-outline", label: "Light freezing drizzle" },
  57: { icon: "rainy-outline", label: "Dense freezing drizzle" },
  61: { icon: "rainy-outline", label: "Slight rain" },
  63: { icon: "rainy-outline", label: "Moderate rain" },
  65: { icon: "rainy-outline", label: "Heavy rain" },
  66: { icon: "rainy-outline", label: "Light freezing rain" },
  67: { icon: "rainy-outline", label: "Heavy freezing rain" },
  71: { icon: "snow-outline", label: "Slight snowfall" },
  73: { icon: "snow-outline", label: "Moderate snowfall" },
  75: { icon: "snow-outline", label: "Heavy snowfall" },
  77: { icon: "snow-outline", label: "Snow grains" },
  80: { icon: "rainy-outline", label: "Slight rain showers" },
  81: { icon: "rainy-outline", label: "Moderate rain showers" },
  82: { icon: "rainy-outline", label: "Violent rain showers" },
  85: { icon: "snow-outline", label: "Slight snow showers" },
  86: { icon: "snow-outline", label: "Heavy snow showers" },
  95: { icon: "thunderstorm-outline", label: "Thunderstorm" },
  96: { icon: "thunderstorm-outline", label: "Thunderstorm with slight hail" },
  99: { icon: "thunderstorm-outline", label: "Thunderstorm with heavy hail" },
};

export const getWeatherInfo = (code: number) => {
  return WMO_WEATHER[code] ?? { icon: "cloud-outline", label: "Unknown" };
};

export const getDayLabel = (date: Date, index: number) => {
  if (index === 0) return "Today";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
};
