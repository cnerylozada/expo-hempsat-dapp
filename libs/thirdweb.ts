import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets/in-app";

const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID!;

if (!clientId) {
  throw new Error(
    "Missing EXPO_PUBLIC_THIRDWEB_CLIENT_ID - make sure to set it in your .env file",
  );
}

export const thirdwebClient = createThirdwebClient({
  clientId,
});

export const thirdwebWallets = [
  inAppWallet({
    auth: {
      options: ["google"],
      passkeyDomain: "com.cnerylozada.hempsat",
    },
  }),
];

export const appChain = sepolia;
