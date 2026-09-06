import { View } from "react-native";

export const ScreenLayout = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-1 p-6">{children}</View>
);
