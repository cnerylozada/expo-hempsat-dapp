import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { getMyUser } from "@/server/users";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { IUser } from "./identification/_components/models";

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
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await SecureStore.getItemAsync("jwt");
      const data = await getMyUser(token);
      setUser(data);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="gap-y-6">
      <WalletAccount />

      {!user?.inquiry_id && (
        <View>
          <Link href={"/(drawer)/dashboard/identification"} asChild>
            <ThemedButton title="Please identify yourself" />
          </Link>
        </View>
      )}
    </View>
  );
}
