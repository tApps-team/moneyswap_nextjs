import Link from "next/link";
import { notFound } from "next/navigation";
import { getExchangerDetails } from "@/entities/exchanger";
import { routes } from "@/shared/router";
import { ExchangerMarker } from "@/shared/types";

export const BlacklistExchangerPage = async ({
  params,
}: {
  params: { exchanger: string };
}) => {
  if (!params?.exchanger) {
    return notFound();
  }

  const [exchangerId, marker] = params.exchanger.split('__');

  if (!exchangerId || !marker) {
    return notFound();
  }

  try {
    const exchangerDetails = await getExchangerDetails({
      exchange_id: Number(exchangerId),
      exchange_marker: marker as ExchangerMarker,
    });

    if (!exchangerDetails) {
      return notFound();
    }

    return (
      <section className="grid xl:grid-cols-[1fr,0.4fr] lg:grid-cols-[1fr,0.5fr] grid-cols-1 gap-7">
        <section className="flex flex-col md:gap-10 gap-6">
        <div className="flex flex-col gap-2">
          <p className="unbounded_font font-semibold text-sm text-[#7A7C80] uppercase">
            Обменный пункт 
          </p>
          <h1 className="unbounded_font xl:text-3xl mobile-xl:text-xl text-base text-red-500 font-semibold uppercase">
            {`${exchangerDetails?.name} — мошенник`}
          </h1>
          <h2 className="unbounded_font xl:text-xl mobile-xl:text-lg text-sm text-white font-normal">
            Обменник находится в черном списке платформы MoneySwap.
          </h2>
          </div>
            <div className="grid grid-flow-row gap-4">
              <h3 className="unbounded_font mobile-xl:text-xl text-base text-white font-semibold">
                Информация об обменнике
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="unbounded_font mobile-xl:text-xl text-base text-white font-semibold">
                Почему обменник попал в черный список?
              </h3>
              <div className="grid gap-4 text-[#7A7C80] mobile-xl:text-base text-sm">
                <div className="bg-red-900/5 border border-red-600/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2 mobile-xl:text-base text-sm">Основные нарушения:</h4>
                  <div className="flex flex-col gap-2 mobile-xl:text-sm text-xs">
                    <span>— Мошеннические операции и обман клиентов</span>
                    <span>— Невыполнение обязательств по обменным операциям</span>
                    <span>— Кража средств пользователей</span>
                    <span>— Отказ от возврата средств без обоснованных причин</span>
                    <span>— Блокировка аккаунтов пользователей с их средствами</span>
                  </div>
                </div>

                <div className="bg-orange-900/5 border border-orange-600/30 rounded-lg p-4">
                  <h4 className="text-orange-400 font-semibold mb-2 mobile-xl:text-base text-sm">Дополнительные факторы:</h4>
                  <div className="flex flex-col gap-2 mobile-xl:text-sm text-xs">
                    <span>— Многочисленные жалобы от пользователей</span>
                    <span>— Подозрительная активность в AML проверках</span>
                    <span>— Отсутствие прозрачности в работе</span>
                    <span>— Нарушение правил платформы MoneySwap</span>
                  </div>
                </div>

                <p className="text-yellow-main mobile-xl:text-base text-sm">
                  <strong>Внимание!</strong> Настоятельно рекомендуем избегать любых операций 
                  с данным обменником. Используйте только проверенные и надежные сервисы 
                  из нашего основного каталога.
                </p>
              </div>
            </div>

            {/* <div className="grid grid-flow-row gap-4">
              <h3 className="unbounded_font mobile-xl:text-xl text-base text-white font-semibold mb-4">
                Как защитить себя от мошенников
              </h3>
              <div className="space-y-4 text-[#B8BCC8]">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Что делать:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>— Проверяйте рейтинги и отзывы</li>
                      <li>— Изучайте условия обмена</li>
                      <li>— Начинайте с малых сумм</li>
                      <li>— Сохраняйте всю переписку</li>
                      <li>— Используйте только проверенные сервисы</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                    <h4 className="text-red-400 font-semibold mb-2">Чего избегать:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>— Слишком выгодных курсов</li>
                      <li>— Предоплат без гарантий</li>
                      <li>— Обменников без отзывов</li>
                      <li>— Подозрительных требований</li>
                      <li>— Обменников из черного списка</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
        </section>
          <div className="flex flex-col gap-6 rounded-[15px] bg-new-dark-grey md:p-6 mobile-xl:p-4 p-3">
            <div className="grid grid-flow-row gap-4 bg-gradient-to-br from-red-600 to-red-800 rounded-lg mobile-xl:p-6 p-3 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold mobile-xl:text-lg text-base truncate">!</span>
                </div>
                <h3 className="unbounded_font font-semibold mobile-xl:text-base text-sm">ОПАСНО</h3>
              </div>
              <p className="mobile-xl:text-sm text-xs">
                Данный обменник находится в черном списке и может причинить вред вашим средствам.
              </p>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-xs font-semibold">НЕ ИСПОЛЬЗУЙТЕ ЭТОТ СЕРВИС!</p>
              </div>
            </div>

            <div className="grid grid-flow-row gap-4">
              <h3 className="unbounded_font mobile-xl:text-base text-sm text-white font-semibold">
                Как избежать мошенничества
              </h3>
              <div className="grid grid-flow-row gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-main rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Проверяйте рейтинг</h4>
                    <p className="text-[#7A7C80] text-xs">Всегда смотрите на оценки и отзывы других пользователей</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-main rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Изучайте условия</h4>
                    <p className="text-[#7A7C80] text-xs">Внимательно читайте правила и условия обмена</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-main rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Проверяйте AML-риск</h4>
                    <p className="text-[#7A7C80] text-xs">Убедитесь, что у обменника низкий AML-риск</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-main rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Сохраняйте доказательства</h4>
                    <p className="text-[#7A7C80] text-xs">Делайте скриншоты переписки и условий</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-flow-row gap-2">
              <h3 className="unbounded_font mobile-xl:text-base text-sm text-white font-semibold">
                Столкнулись с мошенниками?
              </h3>
              <p className="text-[#7A7C80] text-sm">
                Сообщите нам о подозрительных обменниках
              </p>
              <Link href={routes.contacts} className="w-full bg-yellow-main text-black font-medium mobile-xl:text-base text-xs text-center py-2 px-4 rounded-lg transition-colors">
                Подать жалобу
              </Link>
            </div>

            <div className="grid grid-flow-row gap-2">
              <h3 className="unbounded_font mobile-xl:text-base text-sm text-white font-semibold">
                Рекомендуемые обменники
              </h3>
              <p className="text-[#7A7C80] text-sm">
                Используйте только проверенные сервисы из нашего каталога
              </p>
              <Link href={routes.exchangers} className="w-full bg-yellow-main text-black font-medium mobile-xl:text-base text-xs text-center py-2 px-4 rounded-lg transition-colors">
                Перейти к каталогу
              </Link>
            </div>
          </div>
      </section>
    );
  } catch (error) {
    console.error('Error in BlacklistExchangerPage:', error);
    return notFound();
  }
};