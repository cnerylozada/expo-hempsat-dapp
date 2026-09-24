import { appChain } from "@/libs/thirdweb";
import type { Account } from "thirdweb/wallets";

// EIP-712 typed data: the wallet shows each field by name instead of an opaque
// string, and the backend must verify against these exact definitions — keep
// the two in sync when a field is added.
const AREA_ATTESTATION_TYPES = {
  AreaAttestation: [
    { name: "name", type: "string" },
    { name: "description", type: "string" },
  ],
} as const;

export type AreaAttestation = {
  name: string;
  description: string;
};

export const signAreaAttestation = (
  account: Account,
  attestation: AreaAttestation,
) =>
  account.signTypedData({
    domain: { name: "Hempsat", version: "1", chainId: appChain.id },
    types: AREA_ATTESTATION_TYPES,
    primaryType: "AreaAttestation",
    message: attestation,
  });
