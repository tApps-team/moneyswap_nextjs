import { ExchangerStatus } from "@/shared/types";
import { CryptoExchangerBlackList } from "./model/types/exchanger-type";

export const blackListExchangers: CryptoExchangerBlackList[] = [
  {
    id: 1,
    name: {
      ru: 'КриптоСкам',
      en: 'CryptoScam'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://cryptoscam.com'
  },
  {
    id: 2,
    name: {
      ru: 'МошенникЭкс',
      en: 'FraudEx'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://fraudex.net'
  },
  {
    id: 3,
    name: {
      ru: 'НенадежныйОбмен',
      en: 'UnreliableSwap'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://unreliableswap.io'
  },
  {
    id: 4,
    name: {
      ru: 'ПодозрительныйБит',
      en: 'SuspiciousBit'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://suspiciousbit.com'
  },
  {
    id: 5,
    name: {
      ru: 'ЗакрытыйЭкс',
      en: 'ClosedEx'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://closedex.org'
  },
  {
    id: 6,
    name: {
      ru: 'БитМошенник',
      en: 'BitFraud'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://bitfraud.co'
  },
  {
    id: 7,
    name: {
      ru: 'СкамБит',
      en: 'ScamBit'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://scambit.ru'
  },
  {
    id: 8,
    name: {
      ru: 'НенадежныйКрипто',
      en: 'UnreliableCrypto'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://unreliablecrypto.net'
  },
  {
    id: 9,
    name: {
      ru: 'ПодозрительныйОбмен',
      en: 'SuspiciousSwap'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://suspiciousswap.com'
  },
  {
    id: 10,
    name: {
      ru: 'МошенникБит',
      en: 'FraudBit'
    },
    exchange_marker: ExchangerStatus.scam,
    url: 'https://fraudbit.io'
  }
];
