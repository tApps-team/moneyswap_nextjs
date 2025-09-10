import { ExchangerMarker, ExchangerStatus } from "@/shared/types";
import { CryptoExchanger, CryptoExchangerBlackList } from "./model/types/exchanger-type";

export const blackListExchangers: CryptoExchangerBlackList[] = [
  {
    id: 1,
    exchangerName: {
      ru: 'КриптоСкам',
      en: 'CryptoScam'
    },
    exchange_marker: ExchangerMarker.both,
    iconUrl: 'https://cryptoscam.com'
  },
  {
    id: 2,
    exchangerName: {
      ru: 'МошенникЭкс',
      en: 'FraudEx'
    },
    exchange_marker: ExchangerMarker.no_cash,
    iconUrl: 'https://fraudex.net'
  },
  {
    id: 3,
    exchangerName: {
      ru: 'НенадежныйОбмен',
      en: 'UnreliableSwap'
    },
    exchange_marker: ExchangerMarker.cash,
    iconUrl: 'https://unreliableswap.io'
  },
  {
    id: 4,
    exchangerName: {
      ru: 'ПодозрительныйБит',
      en: 'SuspiciousBit'
    },
    exchange_marker: ExchangerMarker.partner,
    iconUrl: 'https://suspiciousbit.com'
  },
  {
    id: 5,
    exchangerName: {
      ru: 'ЗакрытыйЭкс',
      en: 'ClosedEx'
    },
    exchange_marker: ExchangerMarker.partner,
    iconUrl: 'https://closedex.org'
  },
  {
    id: 6,
    exchangerName: {
      ru: 'БитМошенник',
      en: 'BitFraud'
    },
    exchange_marker: ExchangerMarker.no_cash,
    iconUrl: 'https://bitfraud.co'
  },
  {
    id: 7,
    exchangerName: {
      ru: 'СкамБит',
      en: 'ScamBit'
    },
    exchange_marker: ExchangerMarker.both,
    iconUrl: 'https://scambit.ru'
  },
  {
    id: 8,
    exchangerName: {
      ru: 'НенадежныйКрипто',
      en: 'UnreliableCrypto'
    },
    exchange_marker: ExchangerMarker.no_cash,
    iconUrl: 'https://unreliablecrypto.net'
  },
  {
    id: 9,
    exchangerName: {
      ru: 'ПодозрительныйОбмен',
      en: 'SuspiciousSwap'
    },
    exchange_marker: ExchangerMarker.no_cash,
    iconUrl: 'https://suspiciousswap.com'
  },
  {
    id: 10,
    exchangerName: {
      ru: 'МошенникБит',
      en: 'FraudBit'
    },
    exchange_marker: ExchangerMarker.cash,
    iconUrl: 'https://fraudbit.io'
  }
];

export const exchangersList: CryptoExchanger[] = [
  {
    id: 1,
    exchangerName: {
      ru: 'КриптоСкам',
      en: 'CryptoScam'
    },
    exchange_marker: ExchangerMarker.partner,
    workStatus: ExchangerStatus.active,
    reserves: '1000000',
    courses: '1000000',
    url: 'https://cryptoscam.com',
    reviews: {
      positive: 10,
      neutral: 0,
      negative: 0,
    },
  },
  {
    id: 2,
    exchangerName: {
      ru: 'КриптоСкам',
      en: 'CryptoScam'
    },
    exchange_marker: ExchangerMarker.both,
    workStatus: ExchangerStatus.disabled,
    reserves: '1000000',
    courses: '1000000',
    url: 'https://cryptoscam.com',
    reviews: {
      positive: 10,
      neutral: 0,
      negative: 0,
    },
  },
  {
    id: 3,
    exchangerName: {
      ru: 'КриптоСкам',
      en: 'CryptoScam'
    },
    exchange_marker: ExchangerMarker.no_cash,
    workStatus: ExchangerStatus.inactive,
    reserves: '1000000',
    courses: '1000000',
    url: 'https://cryptoscam.com',
    reviews: {
      positive: 10,
      neutral: 0,
      negative: 0,
    },
  },
  {
    id: 4,
    exchangerName: {
      ru: 'КриптоСкам',
      en: 'CryptoScam'
    },
    exchange_marker: ExchangerMarker.cash,
    workStatus: ExchangerStatus.disabled,
    reserves: '1000000',
    courses: '1000000',
    url: 'https://cryptoscam.com',
    reviews: {
      positive: 10,
      neutral: 0,
      negative: 0,
    },
  },
  {
    id: 5,
    exchangerName: {
      ru: 'КриптоСкам',
      en: 'CryptoScam'
    },
    exchange_marker: ExchangerMarker.cash,
    workStatus: ExchangerStatus.inactive,
    reserves: '1000000',
    courses: '1000000',
    url: 'https://cryptoscam.com',
    reviews: {
      positive: 10,
      neutral: 0,
      negative: 0,
    },
  }
]