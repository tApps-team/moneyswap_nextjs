"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelectsStore } from "@/entities/valute";
import { routes } from "@/shared/router";
import { Navbar } from "../navbar";
import styles from "./header.module.scss";

export const Header = () => {
  // header background
  const [isTop, setIsTop] = useState(true);
  const scrollHeader = () => {
    if (window.scrollY >= 30) {
      setIsTop(false);
    } else {
      setIsTop(true);
    }
  };
  useEffect(() => {
    if (path === "/") {
      handeLogoClick();
    }
    window.addEventListener("scroll", scrollHeader);
    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  }, []);

  // clear selects
  const { setGetSelect, setGiveSelect } = useSelectsStore((state) => state);
  const handeLogoClick = () => {
    setGiveSelect(null);
    setGetSelect(null);
  };
  const path = usePathname();

  return (
    <header className={isTop ? styles.header : `${styles.header} ${styles.active}`}>
      <Link onClick={handeLogoClick} href={routes.main} className="link">
        <div>LOGO</div>
      </Link>
      <Navbar />
    </header>
  );
};
