import { ScreenLayout } from "@/components/ScreenLayout";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { queryKeys } from "@/libs/queryKeys";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { getMyUser } from "@/server/users";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useColorScheme, View } from "react-native";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { getUserEmail } from "thirdweb/wallets/in-app";

const WalletAccount = () => {
  const theme = useColorScheme();

  const wallet = useActiveWallet();
  const account = useActiveAccount();

  const { onSignOut } = useAuth();
  const [email, setEmail] = useState<string | undefined>();

  useEffect(() => {
    if (wallet && wallet.id === "inApp") {
      getUserEmail({ client: thirdwebClient }).then(setEmail);
    }
  }, [wallet]);

  return wallet && account ? (
    <View>
      <ConnectButton
        client={thirdwebClient}
        theme={theme || "dark"}
        wallets={thirdwebWallets}
        chain={appChain}
        onDisconnect={async () => {
          await onSignOut();
          router.replace("/(drawer)/login");
        }}
      />

      <View className="mt-4">
        <ThemedText>Connected as {shortenAddress(account.address)}</ThemedText>
        {email && <ThemedText type="subtext">{email}</ThemedText>}
      </View>
    </View>
  ) : (
    <ConnectButton
      client={thirdwebClient}
      theme={theme || "dark"}
      chain={appChain}
    />
  );
};

export default function DashboardScreen() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.users.myUser,
    queryFn: async () => {
      const token = await SecureStore.getItemAsync("jwt");
      return getMyUser(token);
    },
  });

  if (isLoading) {
    return (
      <ScreenLayout>
        <LoadingScreen />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <View className="gap-y-6">
        <WalletAccount />

        {isError && (
          <ThemedText className="dark:text-text-danger-dark">
            Something went wrong: {error.message}
          </ThemedText>
        )}

        {!isError && !data?.inquiry_id && (
          <View>
            <Link href={"/(drawer)/dashboard/identification"} asChild>
              <ThemedButton title="Please identify yourself" />
            </Link>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}
