import { ThemedText } from "@/components/ThemedText";
import { thirdwebClient } from "@/libs/thirdweb";
import { router } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { sepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets/in-app";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google"],
      passkeyDomain: "thirdweb.com",
    },
    smartAccount: {
      chain: sepolia,
      sponsorGas: true,
    },
  }),
];

export default function LoginScreen() {
  const theme = useColorScheme();
  const activeAccount = useActiveAccount();

  useEffect(() => {
    if (activeAccount) {
      router.replace("/(drawer)/dashboard");
    }
  }, [activeAccount]);

  return (
    <View className="flex-1 justify-center">
      <View className="items-center mb-16">
        <ThemedText type="title" className="mb-3 text-center">
          Welcome
        </ThemedText>
        <ThemedText type="subtext" className="text-center">
          Connect your wallet to get started
        </ThemedText>
      </View>

      <View className="items-center">
        <ConnectButton
          client={thirdwebClient}
          theme={theme || "dark"}
          wallets={wallets}
          chain={sepolia}
        />
      </View>
    </View>
  );
}
