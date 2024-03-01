import { FC } from "react";
import { SelectCard } from "@/entities/select";
import styles from "./selectsForm.module.scss";

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
