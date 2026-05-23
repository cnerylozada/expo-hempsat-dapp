import { ThemedText } from "@/components/ThemedText";
import { thirdwebClient } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { sepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets/in-app";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google"],
      passkeyDomain: "com.cnerylozada.hempsat",
    },
    smartAccount: {
      chain: sepolia,
      sponsorGas: true,
    },
  }),
];

export default function LoginScreen() {
  const theme = useColorScheme();
  const { isAuthenticated, signIn } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(drawer)/dashboard");
    }
  }, [isAuthenticated]);

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
          onConnect={async (activeWallet) => {
            const account = activeWallet.getAccount();
            if (!account) return;
            const deadline = Math.floor(Date.now() / 1000) + 60;
            const message = `com.cnerylozada.hempsat_deadline:${deadline}`;
            const signature = await account.signMessage({ message });
            await signIn(account.address, message, signature);
          }}
        />
      </View>
    </View>
  );
}
