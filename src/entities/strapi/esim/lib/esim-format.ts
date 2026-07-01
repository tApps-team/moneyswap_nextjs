import {
  EsimCalls,
  EsimInternetSharing,
  EsimTopUp,
  EsimValidityPeriod,
} from "../api/esim-dto";

const validityPeriodMap: Record<string, string> = {
  from_1_day: "от 1 дня",
  from_3_days: "от 3 дней",
  from_5_days: "от 5 дней",
  from_7_days: "от 7 дней",
  from_10_days: "от 10 дней",
  from_30_days: "от 30 дней",
  from_6_months: "от 6 месяцев",
  from_1_year: "от 1 года",
  from_2_years: "от 2 лет",
  unlimited: "Безлимит",
};

const internetSharingMap: Record<string, string> = {
  with_sharing: "С раздачей интернета",
  without_sharing: "Без раздачи интернета",
};

const callsMap: Record<string, string> = {
  with_calls: "С звонками",
  without_calls: "Без звонков",
};

const topUpMap: Record<string, string> = {
  with_top_up: "С пополнением",
  without_top_up: "Без пополнения",
};

export function formatEsimPrice(price: number) {
  return `от ${price} ₽`;
}

export function formatEsimVolume(gb: number) {
  return `от ${gb} ГБ`;
}

export function formatEsimValidityPeriod(period: EsimValidityPeriod) {
  return validityPeriodMap[period] ?? period;
}

export function formatEsimInternetSharing(value: EsimInternetSharing) {
  return internetSharingMap[value] ?? value;
}

export function formatEsimCalls(value: EsimCalls) {
  return callsMap[value] ?? value;
}

export function formatEsimTopUp(value: EsimTopUp) {
  return topUpMap[value] ?? value;
}
