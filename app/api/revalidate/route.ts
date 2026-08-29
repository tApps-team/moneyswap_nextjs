import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getAllCategories, getAllTags, StrapiCollectionNames } from "@/entities/strapi";
import { routes } from "@/shared/router";

/**
 * Справочники (метки, отзывы, страны, валюты, платёжные системы, платформы)
 * не имеют собственных страниц — они приезжают на фронт внутри агентов / карт / eSIM
 * через populate. Поэтому при их изменении сбрасываем кэш списков и детальных страниц.
 */
/**
 * Страница-хаб /ratings собирает описания разделов из их single types,
 * поэтому обновляется вместе с любой из восьми страниц разделов.
 */
const revalidateRatingsIndex = () => {
  revalidatePath(routes.ratings);
};

const revalidateVedAgents = () => {
  revalidateTag("ved-agents");
  revalidatePath(routes.ved);
  revalidatePath(`${routes.ved_agents}/[slug]`, "page");
};

const revalidateEsims = () => {
  revalidateTag("e-sims");
  revalidatePath(routes.esim);
  revalidatePath(`${routes.esim}/[slug]`, "page");
};

const revalidateVirtualCards = () => {
  revalidateTag("virtual-cards");
  revalidatePath(routes.virtual_cards);
  revalidatePath(`${routes.vc_cards}/[slug]`, "page");
};

const revalidatePaymentServices = () => {
  revalidateTag("payment-services");
  revalidatePath(routes.payment_services);
  revalidatePath(`${routes.payment_services}/[slug]`, "page");
};

const revalidateDebitCards = () => {
  revalidateTag("debit-cards");
  revalidatePath(routes.debit_cards);
};

const revalidateCreditCards = () => {
  revalidateTag("credit-cards");
  revalidatePath(routes.credit_cards);
};

const revalidateBankCredits = () => {
  revalidateTag("bank-credits");
  revalidatePath(routes.credits);
  revalidatePath(`${routes.credits}/[slug]`, "page");
};

const revalidateMicroloans = () => {
  revalidateTag("microloans");
  revalidatePath(routes.microloans);
  revalidatePath(`${routes.microloans}/[slug]`, "page");
};

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const { model, entry, secret } = request;

    console.log("=== REVALIDATION REQUEST ===");
    console.log("Model:", model);
    console.log("Entry:", JSON.stringify(entry, null, 2));
    console.log("Expected model value:", StrapiCollectionNames.article);

    // if (secret !== process.env.NEXT_REVALIDATION_SECRET_KEY) {
    //   console.log("Invalid secret:", secret);
    //   return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    // }

    let path = "";

    // Определяем path на основе коллекции
    switch (model) {
      case StrapiCollectionNames.article:
        path = `${routes.blog}${routes.article}/${entry?.url_name}`;
        console.log("Article path constructed:", path);
        // Инвалидируем теги кэша для статьи
        revalidateTag('article');
        if (entry?.url_name) {
          revalidateTag(`article-${entry.url_name}`);
          console.log("✓ Tag revalidated: article-" + entry.url_name);
        }
        // Инвалидируем путь страницы
        revalidatePath(path);
        await getAllCategories().then((data) => {
          data?.data?.categories.map((cat) => {
            revalidatePath(`${routes.blog}${routes.category}/${cat?.category}`);
          });
        });
        await getAllTags().then((data) => {
          data?.data?.tags.map((tag) => {
            revalidatePath(`${routes.blog}${routes.tag}/${tag?.tag}`);
          });
        });
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.category:
        path = `${routes.blog}${routes.category}/${entry?.category}`;
        console.log("Category path constructed:", path);
        // Инвалидируем теги кэша для категории
        revalidateTag('categories');
        revalidateTag('category-articles');
        if (entry?.category) {
          revalidateTag(`category-${entry.category}`);
          console.log("✓ Tag revalidated: category-" + entry.category);
        }
        revalidatePath(path);
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.tag:
        path = `${routes.blog}${routes.tag}/${entry?.tag}`;
        console.log("Tag path constructed:", path);
        // Инвалидируем теги кэша для тега
        revalidateTag('tags');
        revalidateTag('tag-articles');
        if (entry?.tag) {
          revalidateTag(`tag-${entry.tag}`);
          console.log("✓ Tag revalidated: tag-" + entry.tag);
        }
        revalidatePath(path);
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.about:
        path = routes.about;
        console.log("About path constructed:", path);
        // Инвалидируем теги кэша для about
        revalidateTag('about');
        revalidatePath(path);
        break;
      case StrapiCollectionNames.partner:
        path = routes.partners;
        console.log("Partner path constructed:", path);
        // Инвалидируем теги кэша для partner
        revalidateTag('partner');
        revalidatePath(path);
        break;
      case StrapiCollectionNames.help:
        path = routes.help_faq;
        console.log("Help path constructed:", path);
        // Инвалидируем теги кэша для help
        revalidateTag('help');
        revalidatePath(path);
        break;
      case StrapiCollectionNames.faq:
        path = routes.help_faq;
        console.log("FAQ path constructed:", path);
        // Инвалидируем теги кэша для FAQ
        revalidateTag('faq');
        // Если есть тип FAQ, инвалидируем конкретный тег
        if (entry?.type) {
          revalidateTag(`faq-${entry.type}`);
          console.log("✓ Tag revalidated: faq-" + entry.type);
        }
        revalidatePath(path);
        break;
      case StrapiCollectionNames.topic:
        console.log("Topic revalidation");
        // Инвалидируем теги кэша для topic
        revalidateTag('topic-articles');
        if (entry?.type) {
          revalidateTag(`topic-${entry.type}`);
          console.log("✓ Tag revalidated: topic-" + entry.type);
        }
        revalidatePath(routes.blog);
        break;
      case StrapiCollectionNames.vedPage:
        path = routes.ved;
        revalidateTag("ved-page");
        revalidateTag("ved-agents");
        revalidatePath(routes.ved);
        revalidateRatingsIndex();
        break;
      case StrapiCollectionNames.vedAgent:
        path = entry?.slug ? `${routes.ved_agents}/${entry.slug}` : routes.ved;
        revalidateTag("ved-agents");
        if (entry?.slug) {
          revalidateTag(`ved-agent-${entry.slug}`);
        }
        revalidatePath(routes.ved);
        revalidatePath(path);
        break;
      case StrapiCollectionNames.vcPage:
        path = routes.virtual_cards;
        revalidateTag("vc-page");
        revalidateTag("virtual-cards");
        revalidatePath(routes.virtual_cards);
        revalidateRatingsIndex();
        break;
      case StrapiCollectionNames.virtualCard:
        path = entry?.slug ? `${routes.vc_cards}/${entry.slug}` : routes.virtual_cards;
        revalidateTag("virtual-cards");
        if (entry?.slug) {
          revalidateTag(`virtual-card-${entry.slug}`);
        }
        revalidatePath(routes.virtual_cards);
        revalidatePath(path);
        break;
      case StrapiCollectionNames.esimPage:
        path = routes.esim;
        revalidateTag("esim-page");
        revalidateTag("e-sims");
        revalidatePath(routes.esim);
        revalidateRatingsIndex();
        break;
      case StrapiCollectionNames.eSim:
        path = entry?.slug ? `${routes.esim}/${entry.slug}` : routes.esim;
        revalidateTag("e-sims");
        if (entry?.slug) {
          revalidateTag(`e-sim-${entry.slug}`);
        }
        revalidatePath(routes.esim);
        revalidatePath(path);
        break;
      // --- Справочники VED (метки, отзывы) ---
      case StrapiCollectionNames.vedLabel:
      case StrapiCollectionNames.vedReview:
        path = routes.ved;
        console.log("VED reference collection revalidation:", model);
        revalidateVedAgents();
        break;
      // Страны и валюты общие: страны используются в VED, eSIM и виртуальных картах,
      // валюты — в VED и виртуальных картах.
      case StrapiCollectionNames.vedCountry:
        path = routes.ved;
        console.log("Country revalidation:", model);
        revalidateVedAgents();
        revalidateEsims();
        revalidateVirtualCards();
        break;
      // Валюты используются в ВЭД, виртуальных картах и оплате сервисов.
      case StrapiCollectionNames.vedCurrency:
        path = routes.ved;
        console.log("Currency revalidation:", model);
        revalidateVedAgents();
        revalidateVirtualCards();
        revalidatePaymentServices();
        break;
      // --- Справочники eSIM (метки, отзывы) ---
      case StrapiCollectionNames.esimLabel:
      case StrapiCollectionNames.esimReview:
        path = routes.esim;
        console.log("eSIM reference collection revalidation:", model);
        revalidateEsims();
        break;
      // Платёжные системы общие: eSIM, оплата сервисов и обе карточные выдачи.
      case StrapiCollectionNames.esimPaymentSystem:
        path = routes.esim;
        console.log("Payment system revalidation:", model);
        revalidateEsims();
        revalidatePaymentServices();
        revalidateDebitCards();
        revalidateCreditCards();
        break;
      // --- Справочники виртуальных карт (платёжные системы, отзывы) ---
      case StrapiCollectionNames.vcPaymentSystem:
      case StrapiCollectionNames.vcReview:
        path = routes.virtual_cards;
        console.log("VC reference collection revalidation:", model);
        revalidateVirtualCards();
        break;
      // Сервисы и игры показываются и в виртуальных картах, и в оплате сервисов.
      case StrapiCollectionNames.vcPlatform:
        path = routes.virtual_cards;
        console.log("Platform revalidation:", model);
        revalidateVirtualCards();
        revalidatePaymentServices();
        break;
      // --- Оплата зарубежных сервисов ---
      case StrapiCollectionNames.paymentServicePage:
      case StrapiCollectionNames.paymentService:
        // у single type страницы раздела slug'а нет — ведём на сам раздел
        path =
          model === StrapiCollectionNames.paymentServicePage || !entry?.slug
            ? routes.payment_services
            : `${routes.payment_services}/${entry.slug}`;
        console.log("Payment services revalidation:", model);
        if (model === StrapiCollectionNames.paymentServicePage) {
          revalidateTag("payment-service-page");
          revalidateRatingsIndex();
        }
        if (entry?.slug) {
          revalidateTag(`payment-service-${entry.slug}`);
        }
        revalidatePaymentServices();
        break;
      // --- Дебетовые карты ---
      case StrapiCollectionNames.debitCardPage:
      case StrapiCollectionNames.debitCard:
        path = routes.debit_cards;
        console.log("Debit cards revalidation:", model);
        if (model === StrapiCollectionNames.debitCardPage) {
          revalidateTag("debit-card-page");
          revalidateRatingsIndex();
        }
        revalidateDebitCards();
        break;
      // --- Кредитные карты ---
      case StrapiCollectionNames.creditCardPage:
      case StrapiCollectionNames.creditCard:
        path = routes.credit_cards;
        console.log("Credit cards revalidation:", model);
        if (model === StrapiCollectionNames.creditCardPage) {
          revalidateTag("credit-card-page");
          revalidateRatingsIndex();
        }
        revalidateCreditCards();
        break;
      // --- Кредиты ---
      case StrapiCollectionNames.bankCreditPage:
      case StrapiCollectionNames.bankCredit:
        // у single type страницы раздела slug'а нет — ведём на сам раздел
        path =
          model === StrapiCollectionNames.bankCreditPage || !entry?.slug
            ? routes.credits
            : `${routes.credits}/${entry.slug}`;
        console.log("Bank credits revalidation:", model);
        if (model === StrapiCollectionNames.bankCreditPage) {
          revalidateTag("bank-credit-page");
          revalidateRatingsIndex();
        }
        if (entry?.slug) {
          revalidateTag(`bank-credit-${entry.slug}`);
        }
        revalidateBankCredits();
        break;
      // --- Микрозаймы ---
      case StrapiCollectionNames.microloanPage:
      case StrapiCollectionNames.microloan:
        // у single type страницы раздела slug'а нет — ведём на сам раздел
        path =
          model === StrapiCollectionNames.microloanPage || !entry?.slug
            ? routes.microloans
            : `${routes.microloans}/${entry.slug}`;
        console.log("Microloans revalidation:", model);
        if (model === StrapiCollectionNames.microloanPage) {
          revalidateTag("microloan-page");
          revalidateRatingsIndex();
        }
        if (entry?.slug) {
          revalidateTag(`microloan-${entry.slug}`);
        }
        revalidateMicroloans();
        break;
      // Банк встречается в обеих карточных выдачах и в кредитах.
      case StrapiCollectionNames.bank:
        path = routes.credits;
        console.log("Bank revalidation:", model);
        revalidateDebitCards();
        revalidateCreditCards();
        revalidateBankCredits();
        break;
      // --- Справочники карт (особенности, бонусы) ---
      case StrapiCollectionNames.cardFeature:
      case StrapiCollectionNames.cardBonus:
        path = routes.debit_cards;
        console.log("Card reference collection revalidation:", model);
        revalidateDebitCards();
        revalidateCreditCards();
        break;
      // --- Справочники МФО (каналы выдачи, подборки) ---
      case StrapiCollectionNames.mlIssueChannel:
      case StrapiCollectionNames.mlCollection:
        path = routes.microloans;
        console.log("Microloan reference collection revalidation:", model);
        revalidateMicroloans();
        break;
      default:
        console.log("Unknown model:", model);
        return NextResponse.json({ message: "Unknown model" }, { status: 400 });
    }

    console.log("=== REVALIDATION COMPLETE ===");

    return NextResponse.json({ 
      message: "Revalidation successful",
      path: path || "none",
      model: model 
    });
  } catch (error) {
    console.error("Error during revalidation:", error);
    return NextResponse.json({ message: "Error during revalidation" }, { status: 500 });
  }
}
