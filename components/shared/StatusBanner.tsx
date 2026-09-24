import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type StatusBannerTheme = "success" | "warning" | "error";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type ThemeConfig = {
  icon: IconName;
  surface: string;
  accent: string;
  tint: string;
};

// Class names must stay literal — Tailwind scans the raw file text, so a
// `bg-${color}` template would generate nothing.
const themes: Record<StatusBannerTheme, ThemeConfig> = {
  success: {
    icon: "checkmark-circle",
    surface: "bg-green-600/10",
    accent: "bg-green-600",
    tint: "text-green-600",
  },
  warning: {
    icon: "information-circle",
    surface: "bg-amber-500/10",
    accent: "bg-amber-500",
    tint: "text-amber-500",
  },
  error: {
    icon: "warning",
    surface: "bg-destructive/10",
    accent: "bg-destructive",
    tint: "text-destructive",
  },
};

export type StatusBannerAction = {
  onPress: () => void;
  /** Omit to render an icon-only button — pass `accessibilityLabel` in that case. */
  label?: string;
  icon?: IconName;
};

export type StatusBannerProps = {
  theme: StatusBannerTheme;
  title: string;
  description?: string;
  action?: StatusBannerAction;
};

export function StatusBanner({
  theme,
  title,
  description,
  action,
}: StatusBannerProps) {
  const { icon, surface, accent, tint } = themes[theme];

  return (
    <Box className={`flex-row overflow-hidden rounded-lg ${surface}`}>
      <Box className={`w-1.5 ${accent}`} />

      <Box className="flex-1 flex-row items-start gap-3 p-3">
        <Ionicons name={icon} size={20} className={tint} />

        <Box className="flex-1 gap-0.5">
          <Text bold className="text-foreground">
            {title}
          </Text>
          {description && (
            <Text size="sm" className="text-muted-foreground">
              {description}
            </Text>
          )}
        </Box>

        {action && (
          <Pressable
            onPress={action.onPress}
            hitSlop={8}
            accessibilityRole="button"
            className={
              action.label
                ? `flex-row items-center gap-1.5 rounded-md px-2 py-1 ${surface}`
                : undefined
            }
          >
            {action.icon && (
              <Ionicons name={action.icon} size={16} className={tint} />
            )}
            {action.label && (
              <Text size="sm" bold className={tint}>
                {action.label}
              </Text>
            )}
          </Pressable>
        )}
      </Box>
    </Box>
  );
}
