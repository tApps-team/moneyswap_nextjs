import { ExchangersList } from "@/widgets/exchangersList";
import { getExchangers } from "@/entities/exchanger";
import styles from "./main.module.scss";

export const Main = async () => {
  const exchangers = await getExchangers();
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>MAIN PAGE</h1>
        <p className={styles.description}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
          dolores ut earum saepe illum voluptates, praesentium iusto asperiores
          corporis laborum harum officia ullam excepturi nobis voluptatum
          exercitationem sunt. Dolor, quae!
        </p>
      </div>
      <ExchangersList exchangers={exchangers} />
    </section>
  );
};
