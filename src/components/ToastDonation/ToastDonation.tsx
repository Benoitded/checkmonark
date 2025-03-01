"use client";

// @/src/app/countdown/page.tsx

import React, { useState, useEffect } from "react";
import styles from "./ToastDonation.module.scss";
import CrossIcon from "@/assets/cross.svg";
import toast from "react-hot-toast";
import CopyIcon from "@/assets/copy.svg";
import { track } from "@vercel/analytics";

const DONATION_ADDRESS = "0x96be24b356238f26c7fba5107f03f64e0e5dd108";

const ToastDonation = () => {
  const handleCopy = () => {
    navigator.clipboard.writeText(DONATION_ADDRESS);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      toast(
        (t) => (
          <div className={styles.toast}>
            Found tokens you didn't know about? Support this tool by donating:{" "}
            <>
              <a
                href={`https://etherscan.io/address/${DONATION_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("donation_address_clicked");
                }}
              >
                {DONATION_ADDRESS.slice(0, 6)}...{DONATION_ADDRESS.slice(-4)}
              </a>
              <CopyIcon onClick={handleCopy} className={styles.copyIcon} />
            </>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#c9c9ff",
                width: "16px",
                height: "16px",
                borderRadius: "2px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => toast.dismiss(t.id)}
            >
              <CrossIcon
                style={{ width: "8px", height: "8px", fill: "#007bff" }}
              />
            </button>
          </div>
        ),
        {
          duration: Infinity, // The toast will stay until clicked
          icon: "⭐️",
        }
      );
    }, 12000); // 12 seconds

    return () => clearTimeout(timeout);
  }, []);

  return null;
};

export default ToastDonation;
