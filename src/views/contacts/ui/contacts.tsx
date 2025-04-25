import Link from "next/link";
import { FeedbackForm } from "@/widgets/feedback-form";
import { getAboutPage } from "@/entities/strapi";

export const ContactsPage = async () => {
  return (
    <section className="lg:grid lg:grid-cols-[0.6fr,0.4fr] xl:grid-cols-[0.7fr,0.3fr] flex flex-col gap-10">
      <div className="flex flex-col md:gap-[30px] mobile-xl:gap-5 gap-4 md:text-lg mobile-xl:text-base text-sm font-medium text-white">
        <div className="grid grid-flow-row md:gap-[50px] mobile-xl:gap-10 gap-4">
        <h1 className="unbounded_font lg:text-3xl md:text-2xl mobile-xl:text-xl mobile:text-lg text-base text-yellow-main lg:font-semibold font-medium uppercase md:text-start text-center">Связь с командой MoneySwap</h1>
        <h2 className="">
        У вас есть вопросы по работе сервиса, не нашли нужный обменник в вашем городе, необходимую валюту или направление обмена?
        </h2>
        </div>
        <p className="">Мы всегда на связи и готовы помочь!</p>

        <p className="">Напишите нам через форму — мы ответим как можно быстрее.</p>

        <p className="">Мы на связи с понедельника по пятницу. с 9:00 до 18:00 по МСК.</p>

        <p className="">Также вы можете связаться с нами напрямую:</p>
        <ul className="flex flex-col gap-2">
          <li>Telegram: <Link href="https://t.me/MoneySwap_support" target="_blank" className="text-yellow-main">@MoneySwap_support</Link></li>
          <li>Почта: <span className="text-yellow-main">exchange@moneyswap.online</span></li>
        </ul>

        <div className="xl:text-base text-sm font-normal xl:px-8 px-5 py-5 rounded-[15px] border-[1px] border-[#F6FF5F]/20 lg:text-xl md:text-lg text-white text-center">Пишите — поможем разобраться с обменом, найти подходящий способ перевода или просто ответим на ваш вопрос.</div>
      </div>
      <div className="grow-0"><FeedbackForm type="user" /></div>
    </section>
  );
};
