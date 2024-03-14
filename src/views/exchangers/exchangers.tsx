import { Metadata } from "next";
import { ExchangersList } from "@/widgets/exchangersList";
import { getExchangers } from "@/entities/exchanger";
import styles from "./exchangers.module.scss";

// export async function generateMetadata({
//   params,
// }: {
//   params: { direction: string };
// }): Promise<Metadata> {
//   const direction = params.direction;
//   // тут мб будет запрос на контент по этому направлению (хз как пока)
//   const directionContent = await getContent(direction);

//   return {
//     title: directionContent.title,
//     description: directionContent.description,
//   };
// }

export const Exchangers = async ({ params }: { params: { direction: string } }) => {
  // извлечение значений валют из пути
  const currencies = params.direction.split("-");
  const from = currencies[0];
  const isExchangers = currencies[1];
  const to = currencies[2];
  const city = currencies[3];
  const exchangers = await getExchangers({ from, to, city });

  return (
    <>
      {isExchangers === "to" ? (
        <section className="page__container">
          <div className="content">
            <h1 className="title">EXCHANGERS PAGE</h1>
            <p className="description">
              ЗДЕСЬ БУДЕТ КОНТЕНТ КОТОРЫЙ ЗАВИСИТ ОТ КОНКРЕТНОГО НАПРАВЛЕНИЯ {from} И {to}{" "}
              {city && `и ${city}`}
            </p>
          </div>
          {exchangers.length > 0 ? (
            <ExchangersList exchangers={exchangers} />
          ) : (
            <h3 className="error">Нет обменников с данным направлением :(</h3>
          )}
        </section>
      ) : (
        <div>
          <h1>Страница не найдена...</h1>
        </div>
      )}
    </>
  );
};
