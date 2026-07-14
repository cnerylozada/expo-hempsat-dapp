import { DrawerToggleButton } from "@react-navigation/drawer";
import { HeaderBackButton } from "@react-navigation/elements";
import { useRouter } from "expo-router";

type Props = { tintColor?: string; canGoBack?: boolean };

export const StackHeaderLeft = ({ tintColor, canGoBack }: Props) => {
  const router = useRouter();
  return canGoBack ? (
    <HeaderBackButton tintColor={tintColor} onPress={() => router.back()} />
  ) : (
    <DrawerToggleButton tintColor={tintColor} />
  );
};
