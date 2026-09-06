import { AppButton } from "@/components/AppButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScreenLayout } from "@/components/ScreenLayout";
import { StatusBanner } from "@/components/StatusBanner";
import { useAuthedQuery } from "@/components/authedRequests";
import { Text } from "@/components/ui/text";
import { queryKeys } from "@/libs/queryKeys";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { getMyUser } from "@/server/users";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { getUserEmail } from "thirdweb/wallets/in-app";

const WalletAccount = () => {
  const { colorScheme } = useColorScheme();

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
        theme={colorScheme}
        wallets={thirdwebWallets}
        chain={appChain}
        onDisconnect={async () => {
          await onSignOut();
        }}
      />

      <View className="mt-4">
        <Text>Connected as {shortenAddress(account.address)}</Text>
        {email && <Text>{email}</Text>}
      </View>
    </View>
  ) : (
    <ConnectButton
      client={thirdwebClient}
      theme={colorScheme}
      chain={appChain}
    />
  );
};

export default function DashboardScreen() {
  const { token } = useAuth();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuthedQuery(queryKeys.users.myUser, () => getMyUser(token));

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
          <StatusBanner
            theme="error"
            title="Something went wrong"
            description={error.message}
            action={{
              icon: "refresh",
              label: isRefetching ? "Retrying..." : "Retry",
              onPress: () => refetch(),
            }}
          />
        )}

        {!isError && !data?.inquiry_id && (
          <View>
            <Link href={"/(drawer)/dashboard/identification"} asChild>
              <AppButton text="Please identify yourself" icon="camera-outline" />
            </Link>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}
