"use client";

//basic component which get the actual prize of the gaz current on ethereum
import React, { useEffect, useState } from "react";
import styles from "./Status.module.scss";

interface StatusProps {
  status: "nothing" | "announced" | "checker" | "live" | "closed";
}

const Status = ({ status }: StatusProps) => {
  return (
    //ajoute un bouton pour ferme la pop up, ça save en localstorage
    <div className={`${styles.statusDiv} ${styles[status]}`}>
      <div className={styles.bigCircle} />
      <div className={styles.smallCircle} />
    </div>
  );
};

export default Status;
