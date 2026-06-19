import {
  EsimCalls,
  EsimInternetSharing,
  EsimTopUp,
  EsimValidityPeriod,
} from "../api/esim-dto";

const validityPeriodMap: Record<string, string> = {
  from_1_day: "от 1 дня",
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
