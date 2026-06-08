import { useThemeColor } from "@/utils/useThemeColor";
import {
  ActivityIndicator,
  type PressableProps,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedButtonProps = {
  lightColor?: string;
  darkColor?: string;
  onPress?: PressableProps["onPress"];
  title: string;
  loading?: boolean;
  loadingTitle?: string;
  variant?: "primary" | "secondary";
};

export function ThemedButton(props: ThemedButtonProps) {
  const variant = props.variant ?? "primary";
  const bg = useThemeColor("tint");
  const textInverted = useThemeColor("textInverted");
  const text = useThemeColor("text");
  const textColor = variant == "secondary" ? text : textInverted;
  return (
    <TouchableOpacity
      disabled={props.loading}
      activeOpacity={0.5}
      style={[
        styles.button,
        {
          borderColor: variant == "secondary" ? bg : "transparent",
          borderWidth: variant == "secondary" ? 1 : 0,
          backgroundColor: variant == "secondary" ? "transparent" : bg,
        },
      ]}
      onPress={(e) => {
        props.onPress?.(e);
      }}
    >
      {props.loading && (
        <ActivityIndicator animating={props.loading} color={textColor} />
      )}
      <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
        {props.loading ? props.loadingTitle : props.title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
