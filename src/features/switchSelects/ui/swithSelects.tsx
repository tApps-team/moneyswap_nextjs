"use client";

import { FC } from "react";
import styles from "./switchSelects.module.scss";
import ChangeIcon from "@/shared/assets/icons/changeIcon";

interface SwitchSelectsProps {}

export const SwitchSelects: FC<SwitchSelectsProps> = () => {
  // сделать функцию для свитча, но чтоб она работала именно если два селекта заполнены, то есть надо подтянуть селекты
  return (
    <div className={styles.switcher}>
      <ChangeIcon fill="#fff" width="30px" height="30px" />
    </div>
  );
};
