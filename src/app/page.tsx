// @/app/page.tsx
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import { useAppKit } from "@reown/appkit/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";

import { track } from "@vercel/analytics";
import WindowImage from "@/assets/window.png";
import MonarkLogo from "@/assets/icon_monark.png";

type StatusType = "nothing" | "announced" | "checker" | "live" | "closed";

export default function Home() {
  const [addressInput, setAddressInput] = useState("");
  const [tierData, setTierData] = useState<{
    address: string;
    tier?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState<number | undefined>();
  const { open, close } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressParam = searchParams.get("address");

  function handleOpen() {
    console.log("address", address);
    if (address) {
      if (addressInput.toLowerCase() === address?.toLowerCase()) {
        open();
      } else {
        setAddressInput(address);
        fetchTierData(address);
      }
    } else {
      console.log("connect");
      open();
    }
  }

  useEffect(() => {
    if (error) {
      console.log("error", error);
    }
  }, [error]);

  useEffect(() => {
    console.log("address", address);
    if (address && !addressParam) {
      setAddressInput(address);
      fetchTierData(address);
    }
  }, [address]);

  useEffect(() => {
    if (addressParam) {
      setAddressInput(addressParam);
      fetchTierData(addressParam);
    }
  }, [addressParam]);

  const isValidSolanaAddress = (address: string) => {
    // Solana addresses are base58 encoded and typically 32-44 characters long
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  const fetchTierData = async (address: string) => {
    if (!isValidSolanaAddress(address)) {
      setError(
        "Please enter a valid Solana address to check your eligibility."
      );
      return;
    }
    router.push(`?address=${address}`, { scroll: false });

    // No need for formatting like Ethereum addresses
    const formattedAddress = address;

    setIsLoading(true);
    setError("");
    try {
      const apiResponse = await fetch(
        `/api/getValue?address=${formattedAddress}`
      );
      if (!apiResponse.ok) {
        throw new Error("Error fetching data from API");
      }
      const apiData = await apiResponse.json();
      setTierData(apiData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    setAddressInput(trimmedValue);
    if (isValidSolanaAddress(trimmedValue)) {
      fetchTierData(trimmedValue);
    } else {
      setError(
        "Please enter a valid Solana address to check your eligibility."
      );
    }
  };

  const handleShareOnTwitter = () => {
    // If address is not empty
    const url = addressInput
      ? `https://checkmonark.byzantine.fi?address=${addressInput}`
      : `https://checkmonark.byzantine.fi`;

    const tweetText = `Check out my Monark WL tier!\n${url}\n\n🐴⛓️`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;

    track("share_on_twitter");
    window.open(tweetUrl, "_blank");
  };

  useEffect(() => {
    async function fetchCount() {
      const response = await fetch("/api/getCount");
      const data = await response.json();
      setCount(data);
    }
    fetchCount();
  }, []);

  // Function to get eligibility message based on tier
  const getEligibilityMessage = () => {
    if (isLoading) {
      return "Checking eligibility...";
    }

    if (error) {
      return error;
    }

    if (!tierData) {
      return "Enter your address to check eligibility";
    }

    if (tierData.tier === undefined) {
      return "You are not eligible for any tier.";
    }

    // Map tier to SOL amount
    const tierToSol = {
      1: 10,
      2: 3,
      3: 1,
      4: 0.5,
    };

    return `You're eligible for tier ${tierData.tier} (${
      tierToSol[tierData.tier as keyof typeof tierToSol]
    } SOL).`;
  };

  return (
    <div className={styles.App}>
      <div className={styles.firstSection}>
        <Image src={MonarkLogo} alt="Monark Logo" />
        <h1>Monark WL Checker</h1>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter your Solana address"
            value={addressInput}
            onChange={handleInputChange}
          />
          <span>or</span>
          <button onClick={handleOpen}>
            {isConnected
              ? address?.slice(0, 6) + "..." + address?.slice(-4)
              : "Connect wallet"}
          </button>
        </div>
      </div>
      <div className={styles.allocationCard}>
        <Image src={WindowImage} alt="BeraLand Logo" />
        <div className={styles.content}>{getEligibilityMessage()}</div>
      </div>
      <Link
        href="https://daos.world/"
        target="_blank"
        className={styles.buyButton}
      >
        BUY $MONARK
      </Link>
    </div>
  );
}
