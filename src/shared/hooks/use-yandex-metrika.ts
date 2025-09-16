declare global {
  interface Window {
    ym: (id: number, action: string, target: string) => void;
  }
}

export const useYandexMetrika = () => {
  const reachGoal = (target: string) => {
    if (typeof window !== 'undefined' && window.ym) {
      try {
        if (typeof window.ym === 'function') {
          window.ym(100210634, 'reachGoal', target);
        } else {
          console.warn('Yandex Metrika not initialized yet');
        }
      } catch (error) {
        console.warn('Yandex Metrika goal failed:', error);
      }
    }
  };

  return {
    reachGoal,
    selectTypeCashless: () => reachGoal('select_type_cashless_pc'),
    selectTypeCash: () => reachGoal('select_type_cash_pc'),
    cashlessGive: () => reachGoal('cashless_give_pc'),
    cashlessReceive: () => reachGoal('cashless_receive_pc'),
    cashCountrySelect: () => reachGoal('cash_country_select_pc'),
    cashGive: () => reachGoal('cash_give_pc'),
    cashReceive: () => reachGoal('cash_receive_pc'),
    exchangeRedirect: () => reachGoal('exchange_redirect_pc'),
    reviewsOpen: () => reachGoal('reviews_open_pc'),
    reviewAdd: () => reachGoal('review_add_pc'),
  };
};
