// @/app/page.tsx
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import Barcode from "@/assets/barcode.svg";
import Border from "@/assets/border.svg";
import LinkIcon from "@/assets/link.svg";
import CrossIcon from "@/assets/cross.svg";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useConnect } from "wagmi";
import { getEnsAddress } from "@wagmi/core";
import { track } from "@vercel/analytics";
import WindowImage from "@/assets/window.png";

import { getAddress } from "ethers";
import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import ToastFollow from "@/components/ToastFollow/ToastFollow";
import ToastRecommend from "@/components/ToastRecommend/ToastRecommend";
import ToastDonation from "@/components/ToastDonation/ToastDonation";
import Status from "@/components/Status/Status";
import { rawAllocationsData } from "@/data/allocationData";
import { AllocationId, AllocationRaw, Allocation } from "@/types/allocation";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

type StatusType = "nothing" | "announced" | "checker" | "live" | "closed";

function sortAllocations(allocations: Allocation[]) {
  // 1. Split into three groups
  const numberAllocations = allocations.filter(
    (allocation) => typeof allocation.eligible === "number"
  );
  const trueAllocations = allocations.filter(
    (allocation) => allocation.eligible === true
  );
  const falseAllocations = allocations.filter(
    (allocation) => allocation.eligible === false
  );

  // 2. Sort numeric allocations in descending order
  const sortedNumberAllocations = numberAllocations.sort((a, b) => {
    const aValue = typeof a.eligible === "number" ? a.eligible : 0;
    const bValue = typeof b.eligible === "number" ? b.eligible : 0;
    return bValue - aValue;
  });

  // 3. Combine in order: numbers (descending) -> true -> false
  return [...sortedNumberAllocations, ...trueAllocations, ...falseAllocations];
}

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
  const { address, isConnected } = useAccount();
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

  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address) || address.endsWith(".eth");
  };

  const fetchTierData = async (address: string) => {
    if (!isValidEthereumAddress(address)) {
      setError(
        "Please enter a valid Ethereum address to check your eligibility."
      );
      return;
    }
    router.push(`?address=${address}`, { scroll: false });

    let formattedAddress;
    try {
      formattedAddress = getAddress(address.toLowerCase());
    } catch (error) {
      formattedAddress = address;
    }

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
    if (isValidEthereumAddress(trimmedValue)) {
      if (e.target.value.endsWith(".eth")) {
        const addressWeGot = await getEnsAddress(config, {
          chainId: 1,
          name: trimmedValue.toLowerCase(),
        });
        if (addressWeGot) {
          fetchTierData(addressWeGot);
        }
      } else {
        fetchTierData(trimmedValue);
      }
    } else {
      setError(
        "Please enter a valid Ethereum address to check your eligibility."
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

    return `You're eligible for tier ${tierData.tier}.`;
  };

  return (
    <div className={styles.App}>
      {/* <ToastFollow />
      <ToastRecommend />
      <ToastDonation /> */}
      <div className={styles.firstSection}>
        <h1>Monark WL Checker</h1>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter your EVM address or ENS name"
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
    </div>
  );
}
