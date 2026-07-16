import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { useColorScheme, View } from "react-native";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

export default function LoginScreen() {
  const account = useActiveAccount();
  const theme = useColorScheme();
  const { isAuthenticated, onSignIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  console.log("LoginScreen account...", account?.address);

  const handleSignIn = async (signerAccount: Account) => {
    setError(null);
    setIsSigning(true);
    try {
      const deadline = Math.floor(Date.now() / 1000) + 60;
      const message = `com.cnerylozada.hempsat_deadline:${deadline}`;
      const signature = await signerAccount.signMessage({ message });
      await onSignIn(signerAccount.address, message, signature);
    } catch (err) {
      console.error("LoginScreen sign-in error...", err);
      setError(`${(err as Error).message}. Please retry.`);
    } finally {
      setIsSigning(false);
    }
  };

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

      <View className="items-center gap-4">
        <ConnectButton
          client={thirdwebClient}
          theme={theme || "dark"}
          wallets={thirdwebWallets}
          chain={appChain}
          autoConnect={false}
          onConnect={(activeWallet) => {
            const signerAccount = activeWallet.getAccount();
            if (signerAccount) handleSignIn(signerAccount);
          }}
        />

        {account && !isAuthenticated && (
          <ThemedButton
            title="Retry sign-in"
            loading={isSigning}
            loadingTitle="Signing in..."
            onPress={() => handleSignIn(account)}
          />
        )}

        {error && (
          <ThemedText className="dark:text-text-danger-dark text-center">
            {error}
          </ThemedText>
        )}
      </View>
    </View>
  );
}
