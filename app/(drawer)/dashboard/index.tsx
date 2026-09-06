import { AppButton } from "@/components/AppButton";
import { useAuthedQuery } from "@/components/authedRequests";
import { KycExplainer } from "@/components/identification/KycExplainer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScreenLayout } from "@/components/ScreenLayout";
import { StatusBanner } from "@/components/StatusBanner";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { queryKeys } from "@/libs/queryKeys";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { getMyUser } from "@/server/users";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { cssInterop, useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { getUserEmail } from "thirdweb/wallets/in-app";

cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

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
    <View className="gap-6">
      <ConnectButton
        client={thirdwebClient}
        theme={colorScheme}
        wallets={thirdwebWallets}
        chain={appChain}
        onDisconnect={async () => {
          await onSignOut();
        }}
      />

      {email && (
        <Box className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
          <Box className="rounded-full bg-primary/10 p-2">
            <Ionicons name="mail-outline" size={16} className="text-primary" />
          </Box>
          <Text size="sm" className="flex-1 text-foreground" numberOfLines={1}>
            {email}
          </Text>
        </Box>
      )}
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

  if (isLoading || isRefetching) return <LoadingScreen />;

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
          <View className="gap-3">
            <KycExplainer />

            <Link href={"/(drawer)/dashboard/identification"} asChild>
              <AppButton
                text="Please identify yourself"
                icon="finger-print-outline"
              />
            </Link>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}
