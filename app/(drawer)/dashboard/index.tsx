import { AppButton } from "@/components/AppButton";
import { useAuthedQuery } from "@/components/authedRequests";
import { IdentityCardSheet } from "@/components/identification/IdentityCardSheet";
import { KycExplainer } from "@/components/identification/KycExplainer";
import { InfoCard } from "@/components/InfoCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScreenLayout } from "@/components/ScreenLayout";
import { StatusBanner } from "@/components/StatusBanner";
import { BottomSheet, BottomSheetRef } from "@/components/ui/bottomsheet";
import { queryKeys } from "@/libs/queryKeys";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { getMyUser } from "@/server/users";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { cssInterop, useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
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

      {email && <InfoCard icon="mail-outline" label={email} />}
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
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuthedQuery(queryKeys.users.myUser, () => getMyUser(token));

  if (isLoading || isRefetching) return <LoadingScreen />;

  return (
    // Context provider only — renders no view of its own, so the trigger and
    // the sheet can live in different parts of the tree and still share state.
    <BottomSheet ref={bottomSheetRef}>
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

          {!isError &&
            (data?.inquiry_id ? (
              <InfoCard
                icon="card-outline"
                label="View my ID"
                onPress={() => bottomSheetRef.current?.open()}
              />
            ) : (
              <View className="gap-3">
                <KycExplainer />

                <Link
                  href={"/(drawer)/dashboard/identification/validate-id-card"}
                  asChild
                >
                  <AppButton
                    text="Please identify yourself"
                    icon="finger-print-outline"
                  />
                </Link>
              </View>
            ))}
        </View>
      </ScreenLayout>

      {!isError && data?.inquiry_id && (
        <IdentityCardSheet
          user={data}
          onClose={() => bottomSheetRef.current?.close()}
        />
      )}
    </BottomSheet>
  );
}
