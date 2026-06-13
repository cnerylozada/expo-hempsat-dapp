import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "subtext";
};

const typeClasses: Record<NonNullable<ThemedTextProps["type"]>, string> = {
  default: "text-base leading-6",
  defaultSemiBold: "text-base leading-6 font-semibold",
  title: "text-3xl font-bold leading-8",
  subtitle: "text-xl font-bold",
  subtext: "text-sm leading-5",
};

export function ThemedText({
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={`${typeClasses[type]} text-text dark:text-text-dark ${className ?? ""}`}
      {...rest}
    />
  );
}
