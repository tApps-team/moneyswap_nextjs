"use client";

import { ChangeDirection } from "@/features/changeDirection";
import { FC } from "react";
import { CountryModal } from "@/features/countryModal";
import { directions } from "@/shared/types";
import { CountriesList } from "../countriesList";
import styles from "./sideBar.module.scss";
import { useDirectionStore } from "@/entities/direction";
import { SelectsForm } from "../selectsForm";

interface SideBarProps {}

export const SideBar: FC<SideBarProps> = () => {
  const selectedDirection = useDirectionStore((state) => state.selectedDirection);

  return (
    <section className={styles.sidebar}>
      <ChangeDirection />
      {selectedDirection === directions.cash && (
        <>
          <CountryModal />
          <CountriesList />
        </>
      )}
      <SelectsForm selectedDirection={selectedDirection} />
    </section>
  );
};
