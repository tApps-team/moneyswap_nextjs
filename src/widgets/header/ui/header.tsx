"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { routes } from "@/shared/router";
import { Navbar } from "../navbar";
import styles from "./header.module.scss";

export const Header = () => {
  const [isTop, setIsTop] = useState(true);
  const scrollHeader = () => {
    if (window.scrollY >= 30) {
      setIsTop(false);
    } else {
      setIsTop(true);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  });
  return (
    <header className={isTop ? styles.header : `${styles.header} ${styles.active}`}>
      <Link href={routes.main} className="link">
        <div>LOGO</div>
      </Link>
      <Navbar />
    </header>
  );
};
