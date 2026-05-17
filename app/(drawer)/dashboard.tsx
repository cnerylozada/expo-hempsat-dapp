import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { thirdwebClient } from "@/libs/thirdweb";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { sepolia } from "thirdweb/chains";
import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { getUserEmail, inAppWallet } from "thirdweb/wallets/in-app";

const ConnectWithGoogle = () => {
  const { connect, isConnecting } = useConnect();
  return (
    <ThemedButton
      title="Connect with Google"
      loading={isConnecting}
      loadingTitle="Connecting..."
      onPress={() => {
        connect(async () => {
          const w = inAppWallet({
            smartAccount: {
              chain: sepolia,
              sponsorGas: true,
            },
          });
          await w.connect({
            client: thirdwebClient,
            strategy: "google",
          });
          return w;
        });
      }}
    />
  );
};

const CustomConnectUI = () => {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [email, setEmail] = useState<string | undefined>();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (wallet && wallet.id === "inApp") {
      getUserEmail({ client: thirdwebClient }).then(setEmail);
    }
  }, [wallet]);

  return wallet && account ? (
    <View>
      <ThemedText>Connected as {shortenAddress(account.address)}</ThemedText>
      {email && <ThemedText type="subtext">{email}</ThemedText>}
      <View style={{ height: 16 }} />
      <ThemedButton
        onPress={() => {
          disconnect(wallet);
          router.replace("/(drawer)/login");
        }}
        title="Disconnect"
      />
    </View>
  ) : (
    <>
      <ConnectWithGoogle />
    </>
  );
};

export default function DashboardScreen() {
  return (
    <ScrollView>
      <ThemedText>DashboardScreen</ThemedText>
      <View style={{ gap: 2 }}>
        <ThemedText type="subtitle">{`useConnect()`}</ThemedText>
        <ThemedText type="subtext">
          Hooks to build your own UI. Example below connects to a smart Google
          account or metamask EOA.
        </ThemedText>
      </View>
      <CustomConnectUI />
    </ScrollView>
  );
}
