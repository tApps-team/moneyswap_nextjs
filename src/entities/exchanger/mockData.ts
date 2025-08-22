import { ExchangerMarker, ExchangerStatus } from "@/shared/types";
import { CryptoExchanger, CryptoExchangerBlackList } from "./model/types/exchanger-type";

export const blackListExchangers: CryptoExchangerBlackList[] = [
  {
    id: 1,
    exchangerName: {
      ru: 'КриптоСкам',
      en: 'CryptoScam'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://cryptoscam.com'
  },
  {
    id: 2,
    exchangerName: {
      ru: 'МошенникЭкс',
      en: 'FraudEx'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://fraudex.net'
  },
  {
    id: 3,
    exchangerName: {
      ru: 'НенадежныйОбмен',
      en: 'UnreliableSwap'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://unreliableswap.io'
  },
  {
    id: 4,
    exchangerName: {
      ru: 'ПодозрительныйБит',
      en: 'SuspiciousBit'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://suspiciousbit.com'
  },
  {
    id: 5,
    exchangerName: {
      ru: 'ЗакрытыйЭкс',
      en: 'ClosedEx'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://closedex.org'
  },
  {
    id: 6,
    exchangerName: {
      ru: 'БитМошенник',
      en: 'BitFraud'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://bitfraud.co'
  },
  {
    id: 7,
    exchangerName: {
      ru: 'СкамБит',
      en: 'ScamBit'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://scambit.ru'
  },
  {
    id: 8,
    exchangerName: {
      ru: 'НенадежныйКрипто',
      en: 'UnreliableCrypto'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://unreliablecrypto.net'
  },
  {
    id: 9,
    exchangerName: {
      ru: 'ПодозрительныйОбмен',
      en: 'SuspiciousSwap'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://suspiciousswap.com'
  },
  {
    id: 10,
    exchangerName: {
      ru: 'МошенникБит',
      en: 'FraudBit'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://fraudbit.io'
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