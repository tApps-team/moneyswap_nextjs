import { FC } from "react";
import styles from "./selectsForm.module.scss";
import { SelectCard } from "@/entities/selectCard";

interface SelectsFormProps {}

export const SelectsForm: FC<SelectsFormProps> = () => {
  return (
    <section className={styles.form}>
      {/* <div>
        <p>Отдаю</p>
        <SelectCard />
      </div>
      <div>
        <p>Получаю</p>
        <SelectCard />
      </div> */}
    </section>
  );
};
