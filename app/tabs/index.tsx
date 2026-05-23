import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";
import { sepolia } from "thirdweb/chains";
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

export default function HomeScreen() {
  const theme = useColorScheme();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Link href="/(drawer)/home">
        <ThemedText type="link">Go to home screen!</ThemedText>
      </Link>
      {/* <ConnectButton
        client={thirdwebClient}
        theme={theme || "dark"}
        wallets={wallets}
        chain={sepolia}
      /> */}

      <View style={{ gap: 2 }}>
        <ThemedText type="subtitle">{`useConnect()`}</ThemedText>
        <ThemedText type="subtext">
          Hooks to build your own UI. Example below connects to a smart Google
          account or metamask EOA.
        </ThemedText>
      </View>
      {/* <CustomConnectUI /> */}
    </ScrollView>
  );
}

// const CustomConnectUI = () => {
//   const wallet = useActiveWallet();
//   const account = useActiveAccount();
//   const [email, setEmail] = useState<string | undefined>();
//   const { disconnect } = useDisconnect();
//   useEffect(() => {
//     if (wallet && wallet.id === "inApp") {
//       getUserEmail({ client: thirdwebClient }).then(setEmail);
//     }
//   }, [wallet]);

//   return wallet && account ? (
//     <View>
//       <ThemedText>Connected as {shortenAddress(account.address)}</ThemedText>
//       {email && <ThemedText type="subtext">{email}</ThemedText>}
//       <View style={{ height: 16 }} />
//       <ThemedButton onPress={() => disconnect(wallet)} title="Disconnect" />
//     </View>
//   ) : (
//     <>
//       <ConnectWithGoogle />
//     </>
//   );
// };

// const ConnectWithGoogle = () => {
//   const { connect, isConnecting } = useConnect();
//   return (
//     <ThemedButton
//       title="Connect with Google"
//       loading={isConnecting}
//       loadingTitle="Connecting..."
//       onPress={() => {
//         connect(async () => {
//           const w = inAppWallet({
//             smartAccount: {
//               chain: sepolia,
//               sponsorGas: true,
//             },
//           });
//           await w.connect({
//             client: thirdwebClient,
//             strategy: "google",
//           });
//           return w;
//         });
//       }}
//     />
//   );
// };

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
});
