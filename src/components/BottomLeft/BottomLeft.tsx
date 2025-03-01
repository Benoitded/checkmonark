"use client";

//basic component which get the actual prize of the gaz current on ethereum
import Image from "next/image";
import React from "react";
import styles from "./BottomLeft.module.scss";
import ByzantineIcon from "@/assets/byzantine.svg";
import TwitterIcon from "@/assets/twitter.svg";
import { track } from "@vercel/analytics";
import BeraLandIcon from "@/assets/beraland.png";

//add track for the click on the twitter and byzantine "bottom_left_twitter" and "bottom_left_byzantine"

const BottomLeft = () => {
  return (
    <div className={styles.bottomLeft}>
      {/* <div>with</div> */}
      <a
        href="https://byzantine.fi"
        target="_blank"
        onClick={() => track("byzantine_click", { location: "bottom_left" })}
      >
        <ByzantineIcon width={100} height={27} />
      </a>
      <div className={styles.separator}>|</div>
      <a
        href="https://beraland.xyz"
        target="_blank"
        onClick={() => track("beraland_click", { location: "bottom_left" })}
      >
        {/* <TwitterIcon width={20} height={20} /> */}
        <Image src={BeraLandIcon} alt="BeraLand" width={20} height={20} />
        <span>BeraLand</span>
      </a>
      {/* <Image src={ByzantineIcon} alt="Byzantine" width={24} height={24} /> */}
      {/* <a href="https://twitter.com/byzantine_fi" target="_blank">
        Byzantine
      </a> */}
    </div>
  );
};

export default BottomLeft;
