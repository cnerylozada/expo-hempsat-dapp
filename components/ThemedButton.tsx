import { ActivityIndicator, type PressableProps, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedButtonProps = {
  onPress?: PressableProps["onPress"];
  title: string;
  loading?: boolean;
  loadingTitle?: string;
  variant?: "primary" | "secondary";
};

export function ThemedButton(props: ThemedButtonProps) {
  const variant = props.variant ?? "primary";
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      disabled={props.loading}
      activeOpacity={0.5}
      className={`flex-row gap-2 px-4 py-3 rounded-lg justify-center items-center ${
        isPrimary
          ? "bg-tint"
          : "bg-transparent border border-tint"
      }`}
      onPress={(e) => props.onPress?.(e)}
    >
      {props.loading && (
        <ActivityIndicator
          animating={props.loading}
          color={isPrimary ? "#fff" : "#3366aa"}
        />
      )}
      <ThemedText
        type="defaultSemiBold"
        className={isPrimary ? "text-text-inverted" : "text-tint"}
      >
        {props.loading ? props.loadingTitle : props.title}
      </ThemedText>
    </TouchableOpacity>
  );
}
