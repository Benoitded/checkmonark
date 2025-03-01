"use client";

// @/src/app/countdown/page.tsx

import React, { useState, useEffect } from "react";
import styles from "./ToastFollow.module.scss";
import CrossIcon from "@/assets/cross.svg";
import toast from "react-hot-toast";
import { track } from "@vercel/analytics";

const ToastFollow = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      toast(
        (t) => (
          <div className={styles.toast}>
            Enjoying this app?
            <br />
            Follow us on Twitter!
            <br />
            By{" "}
            <a
              href="https://twitter.com/benoitded"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("twitter_click", { location: "benoitded_toast" })
              }
            >
              @benoitded
            </a>{" "}
            x{" "}
            <a
              href="https://twitter.com/Byzantine_fi"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("twitter_click", { location: "byzantine_toast" })
              }
            >
              @Byzantine_fi
            </a>{" "}
            🐴
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
    }, 5000); // 5 seconds

    return () => clearTimeout(timeout);
  }, []);

  return null;
};

export default ToastFollow;
