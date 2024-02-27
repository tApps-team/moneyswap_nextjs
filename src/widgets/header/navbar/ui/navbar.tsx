"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/shared/router";
import styles from "./navbar.module.scss";

export const Navbar = () => {
  const path = usePathname();
  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={path === routes.about ? styles.active : ""}>
          <Link className="link" href={routes.about}>
            О нас
          </Link>
        </li>
        <li className={path === routes.partners ? styles.active : ""}>
          <Link className="link" href={routes.partners}>
            Партнерам
          </Link>
        </li>
        <li className={path === routes.faq ? styles.active : ""}>
          <Link className="link" href={routes.faq}>
            FAQ
          </Link>
        </li>
      </ul>
    </nav>
  );
};
