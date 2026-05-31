import { ThemedText } from "@/components/ThemedText";
import { appChain, thirdwebClient, thirdwebWallets } from "@/libs/thirdweb";
import { useAuth } from "@/providers/AuthProvider";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
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
  return (
    <View className="gap-y-6">
      <WalletAccount />

      <View>
        <Link href={"/(drawer)/dashboard/identifyMe"}>
          <ThemedText>Go to identify me!</ThemedText>
        </Link>
      </View>
    </View>
  );
}
