import { RatingSectionKey } from "@/shared/consts";

/** Параметры визита: произвольное дерево, которое Метрика показывает в отчётах. */
type YmParams = Record<string, unknown>;

declare global {
  interface Window {
    ym: (id: number, action: string, target: string, params?: YmParams) => void;
  }
}

const COUNTER_ID = 100210634;

/** Одна цель на все рейтинги: разрез по сервисам и агентам лежит в параметрах. */
const RATING_GOAL = "rating_web";

/** Что именно сделал посетитель: открыл карточку агента или ушёл на его сайт. */
export type AgentGoalType = "agent_page" | "agent_site";

export const useYandexMetrika = () => {
  const reachGoal = (target: string, params?: YmParams) => {
    if (typeof window !== "undefined" && window.ym) {
      try {
        if (typeof window.ym === "function") {
          window.ym(COUNTER_ID, "reachGoal", target, params);
        } else {
          console.warn("Yandex Metrika not initialized yet");
        }
      } catch (error) {
        console.warn("Yandex Metrika goal failed:", error);
      }
    }
  };

  /**
   * Цель по агенту рейтинга.
   *
   * Параметры передаются деревом «сервис → действие → слаг», а не тремя
   * плоскими ключами: в отчёте «Параметры визитов» дерево разворачивается
   * по уровням, и видно, сколько открытий и переходов дал каждый раздел.
   * С плоскими ключами такой разрез пришлось бы собирать сегментами.
   */
  const agentGoal = (serviceType: RatingSectionKey, goalType: AgentGoalType, slug: string) =>
    reachGoal(RATING_GOAL, {
      rating: {
        [serviceType]: {
          [goalType]: slug,
        },
      },
    });

  return {
    reachGoal,
    agentGoal,
    agentPageView: (serviceType: RatingSectionKey, slug: string) =>
      agentGoal(serviceType, "agent_page", slug),
    agentSiteClick: (serviceType: RatingSectionKey, slug: string) =>
      agentGoal(serviceType, "agent_site", slug),
    selectTypeCashless: () => reachGoal("select_type_cashless_pc"),
    selectTypeCash: () => reachGoal("select_type_cash_pc"),
    cashlessGive: () => reachGoal("cashless_give_pc"),
    cashlessReceive: () => reachGoal("cashless_receive_pc"),
    cashCountrySelect: () => reachGoal("cash_country_select_pc"),
    cashGive: () => reachGoal("cash_give_pc"),
    cashReceive: () => reachGoal("cash_receive_pc"),
    exchangeRedirect: () => reachGoal("exchange_redirect_pc"),
    reviewsOpen: () => reachGoal("reviews_open_pc"),
    reviewAdd: () => reachGoal("review_add_pc"),
  };
};
