import { DynamicContentItem, DynamicContentType, ComponentPosition } from "@/entities/strapi";

export const privacyMockData: DynamicContentItem[] = [
  {
    content_type: DynamicContentType.paragraph,
    paragraph: {
      title: "Политика конфиденциальности",
      title_id: "privacy-policy",
      title_position: ComponentPosition.center,
      content: `
        <p>Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок сбора, использования и защиты персональной и иной информации Пользователей сайта MoneySwap - https://www.moneyswap.online (далее — «Сайт»).</p>
      `
    }
  },
  {
    content_type: DynamicContentType.paragraph,
    paragraph: {
      title: "1. Общие положения",
      title_id: "general-provisions",
      title_position: ComponentPosition.left,
      content: `
        <p>1.1. Используя Сайт, Пользователь выражает согласие с условиями настоящей Политики.</p>
        <p>1.2. Политика распространяется на всю информацию, которую Сайт может получить о Пользователе в процессе использования им функционала Сайта.</p>
        <p>1.3. Сервис не запрашивает и не собирает избыточную информацию, не требующуюся для предоставления услуг или работы функционала.</p>
      `
    }
  },
  {
    content_type: DynamicContentType.paragraph,
    paragraph: {
      title: "2. Состав собираемых данных",
      title_id: "data-collection",
      title_position: ComponentPosition.left,
      content: `
        <p>2.1. При использовании отдельных функций Сайта могут собираться следующие данные:</p>
        <ul>
          <li>адрес электронной почты, указываемый при регистрации, подписке на уведомления или обращении через форму обратной связи;</li>
          <li>технические данные, передаваемые автоматически при использовании Сайта (IP-адрес, тип браузера, время доступа и т. п.);</li>
          <li>файлы cookie.</li>
        </ul>
        <p>2.2. Файлы cookie — это небольшие текстовые файлы, которые сохраняются в браузере Пользователя и содержат техническую информацию о взаимодействии с сайтом. Cookie используются для обеспечения корректной работы отдельных функций, упрощения навигации и анализа посещаемости.</p>
      `
    }
  },
  {
    content_type: DynamicContentType.paragraph,
    paragraph: {
      title: "3. Цели использования данных",
      title_id: "data-usage",
      title_position: ComponentPosition.left,
      content: `
        <p>3.1. Собранные данные могут использоваться исключительно для:</p>
        <ul>
          <li>обработки обращений и сообщений Пользователей;</li>
          <li>предоставления запрошенной информации;</li>
          <li>улучшения стабильности и удобства работы Сайта;</li>
          <li>аналитики и статистики использования Сайта в обобщённом виде.</li>
        </ul>
      `
    }
  },
  {
    content_type: DynamicContentType.paragraph,
    paragraph: {
      title: "4. Хранение и защита данных",
      title_id: "data-protection",
      title_position: ComponentPosition.left,
      content: `
        <p>4.1. Все полученные данные хранятся в соответствии с мерами информационной безопасности, направленными на предотвращение несанкционированного доступа, изменения, раскрытия или уничтожения данных.</p>
        <p>4.2. Доступ к персональным данным ограничен и предоставляется только в объёме, необходимом для выполнения конкретных задач, связанных с работой Сайта.</p>
        <p>4.3. Администрация Сайта не передаёт персональные данные третьим лицам, за исключением случаев, прямо предусмотренных законодательством.</p>
      `
    }
  },
  {
    content_type: DynamicContentType.paragraph,
    paragraph: {
      title: "5. Права Пользователя",
      title_id: "user-rights",
      title_position: ComponentPosition.left,
      content: `
        <p>5.1. Пользователь вправе в любой момент запросить удаление своих персональных данных, отправив обращение через форму обратной связи (https://www.moneyswap.online/contacts) на Сайте.</p>
        <p>5.2. Пользователь вправе отказаться от получения любых уведомлений, если такая функция предусмотрена.</p>
      `
    }
  },
  {
    content_type: DynamicContentType.paragraph,
    paragraph: {
      title: "6. Изменения Политики",
      title_id: "policy-changes",
      title_position: ComponentPosition.left,
      content: `
        <p>6.1. Администрация Сайта оставляет за собой право вносить изменения в настоящую Политику без предварительного уведомления Пользователей.</p>
        <p>6.2. Новая редакция Политики вступает в силу с момента её публикации на Сайте.</p>
      `
    }
  },
  {
    content_type: DynamicContentType.paragraph,
    paragraph: {
      title: null,
      title_id: null,
      title_position: ComponentPosition.left,
      content: `
        <p><strong>Дата последнего обновления - 19.09.2025</strong></p>
      `
    }
  }
];
