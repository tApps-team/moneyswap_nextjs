import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlackListDetails } from "@/entities/exchanger";
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
    const exchangerDetails = await getBlackListDetails({
      exchange_id: Number(exchangerId),
      exchange_marker: marker as ExchangerMarker,
    });

    if (!exchangerDetails) {
      return notFound();
    }

    return (
      <section className="grid xl:grid-cols-[1fr,0.4fr] lg:grid-cols-[1fr,0.5fr] grid-cols-1 gap-7">
        <section className="flex flex-col md:gap-10 gap-6">
          <div className="grid md:grid-cols-[auto,1fr] md:justify-items-start items-start justify-items-center grid-cols-1 md:gap-10 gap-6">
            <Image 
              className="rounded-full xl:size-48 lg:size-40 size-32 object-cover" 
              src={exchangerDetails?.iconUrl || ""} 
              alt={exchangerDetails?.exchangerName?.ru || ""} 
              width={500} 
              height={500} 
            />
            <div className="flex flex-col gap-2 justify-center">
              <p className="md:text-start text-center unbounded_font font-semibold text-sm text-[#7A7C80] uppercase">
                Обменный пункт 
              </p>
              <h1 className="md:text-start text-center unbounded_font xl:text-3xl mobile-xl:text-xl text-base text-red-500 font-semibold uppercase">
                {`${exchangerDetails?.exchangerName?.ru} — в черном списке`}
              </h1>
              <h2 className="md:text-start text-center unbounded_font lg:text-base mobile-xl:text-sm text-xs font-medium uppercase text-font-light-grey">
                {`Обменник ${exchangerDetails?.exchangerName?.ru} (${exchangerDetails?.url}) замечен в мошеннических действиях.`}
              </h2>
            </div>
          </div>

          <div className="bg-orange-900/5 border border-orange-600/30 rounded-lg p-4">
            <h3 className="mobile-xl:text-lg text-base text-white font-medium">
              Пользователи сообщают, что после перевода средств обмен не производится, а служба поддержки либо игнорирует обращения, либо полностью пропадает.
            </h3>
          </div>

          <div className="bg-red-900/5 border border-red-600/30 rounded-lg p-4">
            <h4 className="text-red-400 uppercase font-semibold mb-2 mobile-xl:text-base text-sm">Наиболее частые схемы обмана:</h4>
            <div className="flex flex-col gap-2 mobile-xl:text-sm text-xs">
              <span>— отсутствие перевода после оплаты</span>
              <span>— блокировка аккаунта клиента</span>
              <span>— отправка фальшивых подтверждений транзакции</span>
              <span>— обещание вернуть деньги, которое так и не выполняется.</span>
            </div>
          </div>

          <div className="text-font-light-grey font-semibold mobile-xl:text-base text-sm">
            Часто такие обменники привлекают подозрительно выгодными условиями — курс может быть на уровне рыночного или даже ниже, чтобы вызвать доверие и подтолкнуть к быстрой оплате.
          </div>

          {exchangerDetails?.linked_urls.length > 0 && (
            <div className="grid grid-flow-row gap-4">
              <h3 className="mobile-xl:text-lg text-base text-yellow-main font-medium">
               Осторожно! У мошенника есть и другие источники:
              </h3>
              <div className="flex flex-col gap-2 mobile-xl:text-base text-sm">
                {exchangerDetails?.linked_urls?.map((url) => (
                  <p className="text-font-light-grey font-normal" key={url}>{url}</p>
                ))}
              </div>
            </div>
          )}

          <p className="unbounded_font text-yellow-main uppercase mobile-xl:text-sm text-xs">
            <strong>Внимание!</strong> Команда MoneySwap настоятельно не рекомендует пользоваться услугами {exchangerDetails?.exchangerName?.ru}, чтобы не потерять средства.
          </p>

        </section>
        <div className="h-fit flex flex-col gap-6 rounded-[15px] bg-new-dark-grey md:p-6 mobile-xl:p-4 p-3">
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
                  <h4 className="text-white font-medium text-sm">Рейтинг обменника</h4>
                  <p className="text-[#7A7C80] text-xs">Проверяйте отзывы на независимых площадках</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-main rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Изучите сервис</h4>
                  <p className="text-[#7A7C80] text-xs">Уточняйте реквизиты, контакты менеджера и юридическую информацию</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-main rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Не спешите</h4>
                  <p className="text-[#7A7C80] text-xs">Не торопитесь с переводом средств, особенно при первом обращении</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-main rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black text-xs font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Надёжность</h4>
                  <p className="text-[#7A7C80] text-xs">Используйте только проверенные сервисы</p>
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