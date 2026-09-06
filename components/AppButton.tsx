import { Button, ButtonText } from "@/components/ui/button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { ActivityIndicator } from "react-native";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});
cssInterop(ActivityIndicator, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type AppButtonTheme = "primary" | "secondary" | "danger";
type IconName = React.ComponentProps<typeof Ionicons>["name"];

export type AppButtonProps = {
  text: string;
  onPress?: () => void;
  theme?: AppButtonTheme;
  /** Icon rendered after the text. */
  icon?: IconName;
  /** Border + tinted text instead of a filled background. */
  outline?: boolean;
  /** Shows a spinner in place of text/icon and disables the button. */
  loading?: boolean;
  disabled?: boolean;
};

const themes: Record<
  AppButtonTheme,
  {
    solidBg: string;
    solidText: string;
    outlineBorder: string;
    outlineText: string;
  }
> = {
  primary: {
    solidBg:
      "bg-primary data-[hover=true]:bg-primary/90 data-[active=true]:bg-primary/90",
    solidText: "text-primary-foreground",
    outlineBorder:
      "bg-transparent border border-primary data-[active=true]:bg-primary/10",
    outlineText: "text-primary",
  },
  secondary: {
    solidBg:
      "bg-secondary data-[hover=true]:bg-secondary/80 data-[active=true]:bg-secondary/80",
    solidText: "text-secondary-foreground",
    outlineBorder:
      "bg-transparent border border-border data-[active=true]:bg-accent",
    outlineText: "text-foreground",
  },
  danger: {
    solidBg:
      "bg-destructive data-[hover=true]:bg-destructive/90 data-[active=true]:bg-destructive/90",
    // No `--destructive-foreground` token exists (see tailwind.config.js /
    // config.ts) — gluestack's own Button falls back to `text-white` for its
    // `destructive` variant for the same reason; matched here for consistency.
    solidText: "text-white",
    outlineBorder:
      "bg-transparent border border-destructive data-[active=true]:bg-destructive/10",
    outlineText: "text-destructive",
  },
};

export function AppButton({
  text,
  onPress,
  theme = "primary",
  icon,
  outline = false,
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const { solidBg, solidText, outlineBorder, outlineText } = themes[theme];
  const textClass = outline ? outlineText : solidText;

  return (
    <Button
      onPress={() => onPress?.()}
      disabled={disabled || loading}
      className={`${outline ? outlineBorder : solidBg} active:opacity-50`}
      size="lg"
    >
      {loading ? (
        <ActivityIndicator className={textClass} />
      ) : (
        <>
          <ButtonText className={`${textClass} text-base`}>{text}</ButtonText>
          {icon && <Ionicons name={icon} size={18} className={textClass} />}
        </>
      )}
    </Button>
  );
}
