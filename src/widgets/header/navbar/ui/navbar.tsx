"use client";

import Link from "next/link";
import styles from "./navbar.module.scss";
import { routes } from "@/shared/router";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const path = usePathname();
  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={path === routes.about ? styles.active : ""}>
          <Link className="link" href={routes.about}>
            About
          </Link>
        </li>
        <li className={path === routes.todos ? styles.active : ""}>
          <Link className="link" href={routes.todos}>
            Todos
          </Link>
        </li>
      </ul>
    </nav>
  );
};
