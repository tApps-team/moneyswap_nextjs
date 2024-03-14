import { ExchangersList } from "@/widgets/exchangersList";
import { getExchangers } from "@/entities/exchanger";
import styles from "./main.module.scss";
import { SideBar } from "@/widgets/sideBar";

export const Main = async () => {
  const exchangers = await getExchangers({ from: "btc", to: "sberrub" });
  return (
    <>
      {/* <SideBar /> */}
      <section className="page__container">
        <div className="content">
          <h1 className="title">MAIN PAGE</h1>
          <p className="description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente dolores ut earum saepe
            illum voluptates, praesentium iusto asperiores corporis laborum harum officia ullam
            excepturi nobis voluptatum exercitationem sunt. Dolor, quae!
          </p>
        </div>
        <ExchangersList exchangers={exchangers} />
      </section>
    </>
  );
};
