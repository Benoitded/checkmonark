import React from "react";
import Link from "next/link";

import styles from "./page.module.scss";

export default function Custom404() {
  return (
    <div className={styles.main404}>
      <div className={styles.text404}>
        <span>404</span>
        <div>page not found.</div>
      </div>
      <div className={styles.desc404}>
        Go back to <Link href={"/"}>home page</Link> or tell us what happened{" "}
        <a href="https://twitter.com/benoitded" target="_blank">
          here
        </a>
      </div>
    </div>
  );
}
