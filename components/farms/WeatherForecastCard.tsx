import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { IForecast } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { getDayLabel, getWeatherInfo } from "./utils";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type WeatherForecastCardProps = {
  forecastList: IForecast[];
};

export const WeatherForecastCard = ({
  forecastList,
}: WeatherForecastCardProps) => {
  const [today, ...nextDays] = forecastList;
  const todayWeather = getWeatherInfo(today.weatherCode);

  return (
    <Box className="gap-4 rounded-xl border border-border bg-card p-4">
      <Box className="flex-row items-center gap-4">
        <Box className="rounded-full bg-primary/10 p-4">
          <Ionicons
            name={todayWeather.icon}
            size={36}
            className="text-primary"
          />
        </Box>

        <Box className="flex-1 gap-1">
          <Text
            size="2xs"
            className="uppercase tracking-wide text-muted-foreground"
          >
            Today
          </Text>
          <Text size="lg" bold className="text-foreground">
            {todayWeather.label}
          </Text>
          <Badge variant="outline" className="gap-1 self-start">
            <Ionicons
              name="water-outline"
              size={12}
              className="text-foreground"
            />
            <BadgeText>{today.humidity}% humidity</BadgeText>
          </Badge>
        </Box>

        <Box className="items-end">
          <Text size="4xl" bold className="text-foreground">
            {today.maxTemp}°
          </Text>
          <Text size="sm" className="text-muted-foreground">
            Low {today.minTemp}°
          </Text>
        </Box>
      </Box>

      <Box className="h-px bg-border" />

      <Box className="flex-row gap-2">
        {nextDays.map((day, index) => {
          const weather = getWeatherInfo(day.weatherCode);
          return (
            <Box
              key={day.date.toISOString()}
              className="flex-1 items-center gap-1 rounded-lg bg-muted py-3"
            >
              <Text
                size="2xs"
                className="uppercase tracking-wide text-muted-foreground"
              >
                {getDayLabel(day.date, index + 1)}
              </Text>
              <Ionicons
                name={weather.icon}
                size={26}
                className="text-primary"
              />
              <Text size="md" bold className="text-foreground">
                {day.maxTemp}°
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {day.minTemp}°
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
