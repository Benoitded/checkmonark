"use client";

import { projectId } from "@/config/configReown";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ReactNode } from "react";

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Check Monark",
  description:
    "Monark DAO is focused on harnessing the full potential of the Monad blockchain ecosystem.",
  url: "https://checkmonark.byzantine.fi/", // origin must match your domain & subdomain
  //get the
  icons: ["/icon.png"],
};

// Create the modal
const modal = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false,
    socials: [],
  },
});

function ReownProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default ReownProvider;
