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

// A disabled button reads as inert rather than merely faded, so it drops the
// theme colour entirely instead of relying on Button's `data-[disabled=true]`
// opacity — that alone would leave a washed-out but still-coloured primary
// button, which looks like a rendering glitch more than an unavailable action.
// `opacity-100` neutralises that base rule so these muted tokens land as-is.
const disabledSurface = {
  solid: "bg-muted data-[disabled=true]:opacity-100",
  outline: "bg-transparent border border-border data-[disabled=true]:opacity-100",
  text: "text-muted-foreground",
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

  // `loading` keeps the theme colour — it is busy, not unavailable.
  const surfaceClass = disabled
    ? outline
      ? disabledSurface.outline
      : disabledSurface.solid
    : `${outline ? outlineBorder : solidBg} active:opacity-50`;

  const textClass = disabled
    ? disabledSurface.text
    : outline
      ? outlineText
      : solidText;

  return (
    <Button
      onPress={() => onPress?.()}
      disabled={disabled || loading}
      className={surfaceClass}
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
