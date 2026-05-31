import { ThemedText } from "@/components/ThemedText";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

export default function LoginScreen() {
  const theme = useColorScheme();
  const { isAuthenticated, onSignIn } = useAuth();
  const router = useRouter();

  const activeAccount = useActiveAccount();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("LoginScreen useEffect isAuthenticated ...");
      router.replace("/(drawer)/dashboard");
    }
  }, [isAuthenticated]);

  if (activeAccount) {
    console.log("LoginScreen activeAccount...");
    return (
      <View className="flex-1 justify-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

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
          wallets={thirdwebWallets}
          chain={appChain}
          onConnect={async (activeWallet) => {
            const account = activeWallet.getAccount();
            if (!account) return;
            const deadline = Math.floor(Date.now() / 1000) + 60;
            const message = `com.cnerylozada.hempsat_deadline:${deadline}`;
            const signature = await account.signMessage({ message });
            await onSignIn(account.address, message, signature);
          }}
        />
      </View>
    </View>
  );
}
