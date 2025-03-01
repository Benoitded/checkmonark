"use client";

// @/src/app/countdown/page.tsx

import React, { useState, useEffect } from "react";
import styles from "./ToastRecommend.module.scss";
import CrossIcon from "@/assets/cross.svg";
import toast from "react-hot-toast";
import { track } from "@vercel/analytics";

const ToastRecommend = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      toast(
        (t) => (
          <div className={styles.toast}>
            A recent airdrop is missing?
            <br />
            Send us a message on Twitter!
            <br />
            <a
              href="https://twitter.com/benoitded"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("twitter_click", { location: "benoitded_toast" })
              }
            >
             DM @benoitded
            </a>{" "}
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
    }, 30000); // 30 seconds

    return () => clearTimeout(timeout);
  }, []);

  return null;
};

export default ToastRecommend;
