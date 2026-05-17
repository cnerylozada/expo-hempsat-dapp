import { thirdwebClient } from "@/libs/thirdweb";
import { Text, useColorScheme, View } from "react-native";
import { sepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets/in-app";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google"],
      passkeyDomain: "thirdweb.com",
    },
    smartAccount: {
      chain: sepolia,
      sponsorGas: true,
    },
  }),
];

export default function LoginScree() {
  const theme = useColorScheme();

  return (
    <View>
      <View>
        <Text>LoginScreen</Text>
        <ConnectButton
          client={thirdwebClient}
          theme={theme || "dark"}
          wallets={wallets}
          chain={sepolia}
        />
      </View>
    </View>
  );
}
