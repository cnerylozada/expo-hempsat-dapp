import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  ActivityIndicator,
  type PressableProps,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedButtonProps = {
  onPress?: PressableProps["onPress"];
  title: string;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  loading?: boolean;
  loadingTitle?: string;
};

export function ThemedButton(props: ThemedButtonProps) {
  return (
    <TouchableOpacity
      disabled={props.loading}
      activeOpacity={0.5}
      className="flex-row gap-2 px-4 py-3 rounded-lg justify-center items-center bg-tint"
      onPress={(e) => props.onPress?.(e)}
    >
      {props.loading && (
        <ActivityIndicator animating={props.loading} color={"#fff"} />
      )}
      {props.iconName && (
        <Ionicons name={props.iconName} size={20} color={"#fff"} />
      )}
      <ThemedText type="defaultSemiBold" className={"text-text-inverted"}>
        {props.loading ? props.loadingTitle : props.title}
      </ThemedText>
    </TouchableOpacity>
  );
}
