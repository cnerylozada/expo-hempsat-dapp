import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "subtext";
};

const typeClasses: Record<NonNullable<ThemedTextProps["type"]>, string> = {
  default: "text-base leading-6 text-text dark:text-text-dark",
  defaultSemiBold:
    "text-base leading-6 font-semibold text-text dark:text-text-dark",
  title: "text-3xl font-bold leading-8 text-text dark:text-text-dark",
  subtitle: "text-xl font-bold text-text dark:text-text-dark",
  subtext: "text-sm leading-5 text-subtext dark:text-subtext-dark",
};

export function ThemedText({
  style,
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={`${typeClasses[type]} ${className ?? ""}`}
      style={style}
      {...rest}
    />
  );
}
