// @/app/layout.tsx

import type { Metadata, Viewport } from "next";
// import "./globals.css";
import ReownProvider from "@/context/reown";
import { headers } from "next/headers";
import "@/styles/globals.css";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { Baloo_Thambi_2 } from "next/font/google";

import BottomLeft from "@/components/BottomLeft/BottomLeft";
import { Analytics } from "@vercel/analytics/react";
import backgroundImage from "@/assets/background.webp";
import beraLandLogo from "@/assets/beraland.png";

const baloo = Baloo_Thambi_2({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Check Monark - Berachain ecosytem airdrop checker",
  description:
    "Monark DAO is focused on harnessing the full potential of the Monad blockchain ecosystem.",

  keywords: [
    "checkmonark",
    "berachain",
    "RFA",
    "RFB",
    "RFC",
    "beraland",
    "ooga",
    "booga",
    "henlo",
    "monark",
    "monad",
    "checkdrop",
    "checkeigen",
    "check",
    "eigen",
    "drop",
    "airdrop",
    "checker",
    "season",
    "eigenlayer",
    "renzo",
    "swell",
    "etherfi",
    "stakestone",
    "symbiotic",
    "crypto",
    "restaking",
    "staking",
    "blockchain",
    "protocol",
    "DeFi",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    images: ["/og-image.png"],
    type: "website",
    siteName: "Check Monark",
    title: "Check Monark",
    description:
      "Monark DAO is focused on harnessing the full potential of the Monad blockchain ecosystem.",
    url: "https://checkmonark.byzantine.fi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Check Monark",
    description:
      "Monark DAO is focused on harnessing the full potential of the Monad blockchain ecosystem.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const NoSSR = dynamic(() => import("@/components/NoSSR"), { ssr: false });
  const cookies = headers().get("cookie");

  //add gas component
  return (
    <html lang="en" className={baloo.className}>
      <body>
        <Analytics />
        <NoSSR>
          <ReownProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#e8e3ff",
                  // color: "#FFF",
                },
              }}
            />
            {/* <BottomLeft /> */}
            {children}
          </ReownProvider>
        </NoSSR>
        {/* <Image
          src={beraLandLogo}
          alt="beraland"
          className={"beraLandLogo"}
          width={1000}
          height={1000}
        /> */}
      </body>
    </html>
  );
}
