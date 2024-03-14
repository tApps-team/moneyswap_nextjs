"use client";

import { FC } from "react";
import styles from "./switchSelects.module.scss";
import ChangeIcon from "@/shared/assets/icons/changeIcon";
import { useSelectsStore } from "@/entities/valute";
import { useLocationStore } from "@/entities/location";
import { useRouter } from "next/navigation";

interface SwitchSelectsProps {}

export const SwitchSelects: FC<SwitchSelectsProps> = () => {
  const { switcher, giveSelect, getSelect } = useSelectsStore((state) => state);
  const city = useLocationStore((state) => state.city);

  const router = useRouter();

  // сделать потом асинхронным switcher
  const handleSwitch = () => {
    if (giveSelect && getSelect) {
      switcher();

      if (city) {
        const pagePathCash = `${getSelect.code_name}-to-${giveSelect.code_name}-${city.code_name}`;
        router.push(pagePathCash);
      } else {
        const pagePathNoncash = `${getSelect.code_name}-to-${giveSelect.code_name}`;
        router.push(pagePathNoncash);
      }
    }
  };

  return (
    <div onClick={handleSwitch} className={styles.switcher}>
      <ChangeIcon fill={giveSelect && getSelect ? "#fff" : "#909090"} width="30px" height="30px" />
    </div>
  );
};
