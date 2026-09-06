import { StatusBanner } from "@/components/StatusBanner";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { View } from "react-native";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

export default function LoginScreen() {
  const account = useActiveAccount();
  const { colorScheme } = useColorScheme();
  const { isAuthenticated, onSignIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

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
    <View className="flex-1 justify-center gap-4 px-6">
      {error && (
        <StatusBanner
          theme="error"
          title="Sign-in failed"
          description={error}
          action={
            account
              ? {
                  icon: "refresh",
                  label: isSigning ? "Signing in..." : "Retry",
                  onPress: () => !isSigning && handleSignIn(account),
                }
              : undefined
          }
        />
      )}

      {!error && account && !isAuthenticated && (
        <StatusBanner
          theme="warning"
          title="Wallet connected"
          description="Sign in to continue."
          action={{
            icon: "log-in",
            label: isSigning ? "Signing in..." : "Sign in",
            onPress: () => !isSigning && handleSignIn(account),
          }}
        />
      )}

      <Box className="gap-6 rounded-2xl border border-border bg-card p-6">
        <Box className="items-center gap-3">
          <Box className="h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            {/* Placeholder until the hempsat mark is available. */}
            <Ionicons
              name="leaf"
              size={28}
              className="text-primary-foreground"
            />
          </Box>

          <Box className="items-center gap-1">
            <Text size="2xl" bold className="text-foreground">
              Welcome Back!
            </Text>
            <Text size="sm" className="text-muted-foreground">
              Connect your wallet to get started
            </Text>
          </Box>
        </Box>

        <Box className="items-center">
          <ConnectButton
            client={thirdwebClient}
            theme={colorScheme}
            wallets={thirdwebWallets}
            chain={appChain}
            autoConnect={false}
            onConnect={(activeWallet) => {
              const signerAccount = activeWallet.getAccount();
              if (signerAccount) handleSignIn(signerAccount);
            }}
          />
        </Box>
      </Box>
    </View>
  );
}
