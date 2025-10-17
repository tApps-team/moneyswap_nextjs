export const handleBannerExchanger = (id: string): string | null => {
  const foundExchanger = BANNER_EXCHANGERS.find(exchanger => exchanger.old_id.toString() === id);
  return foundExchanger ? foundExchanger.new_id.toString() : null;
}

export const BANNER_EXCHANGERS = [
    {
      "name": "El-Change",
      "old_id": 46,
      "new_id": 1426,
    },
    {
      "name": "Kupitman",
      "old_id": 54,
      "new_id": 1466,
    },
    {
      "name": "WmCurrency",
      "old_id": 97,
      "new_id": 1566,
    },
    {
      "name": "MChanger",
      "old_id": 365,
      "new_id": 1477,
    },
    {
      "name": "CoinCat",
      "old_id": 65,
      "new_id": 1400,
    },
    {
      "name": "Mason-Ex",
      "old_id": 241,
      "new_id": 1476,
    },
    {
      "name": "moneta365",
      "old_id": 120,
      "new_id": 1484,
    },
    {
      "name": "MultiXchange",
      "old_id": 360,
      "new_id": 1493,
    },
    {
      "name": "OneClick24",
      "old_id": 359,
      "new_id": 1508,
    },
    {
      "name": "Transfer24",
      "old_id": 89,
      "new_id": 1550,
    },
    {
      "name": "BukhtaObmena",
      "old_id": 56,
      "new_id": 1382,
    },
    {
      "name": "YaObmen",
      "old_id": 354,
      "new_id": 1577,
    },
    {
      "name": "Vobmenka",
      "old_id": 126,
      "new_id": 1559,
    },
    {
      "name": "Air-Buy",
      "old_id": 353,
      "new_id": 1341,
    },
    {
      "name": "Terminal.Cash",
      "old_id": 332,
      "new_id": 1548,
    },
    {
      "name": "Poteme",
      "old_id": 135,
      "new_id": 1519,
    },
    {
      "name": "AlwaysMoney",
      "old_id": 331,
      "new_id": 1349,
    },
    {
      "name": "GreenEX",
      "old_id": 87,
      "new_id": 1455,
    },
    {
      "name": "Elvira Exchange",
      "old_id": 290,
      "new_id": 1427,
    },
    {
      "name": "Obmenko",
      "old_id": 51,
      "new_id": 1504,
    },
    {
      "name": "LunaBit",
      "old_id": 295,
      "new_id": 1473,
    },
    {
      "name": "CoinClick",
      "old_id": 95,
      "new_id": 1401,
    },
    {
      "name": "Nordex",
      "old_id": 127,
      "new_id": 1502,
    },
    {
      "name": "SpaseSwap",
      "old_id": 286,
      "new_id": 1533,
    },
    {
      "name": "60sek",
      "old_id": 138,
      "new_id": 1337,
    },
    {
      "name": "Bitox",
      "old_id": 285,
      "new_id": 1372,
    },
    {
      "name": "FreeChange",
      "old_id": 148,
      "new_id": 1445,
    },
    {
      "name": "CoinPoint",
      "old_id": 94,
      "new_id": 1609,
    },
    {
      "name": "MoneyMate",
      "old_id": 150,
      "new_id": 1486,
    },
    {
      "name": "YChangers",
      "old_id": 276,
      "new_id": 1578,
    },
    {
      "name": "ЯВплюс",
      "old_id": 275,
      "new_id": 1594,
    },
    {
      "name": "OPG-Swap",
      "old_id": 259,
      "new_id": 1511,
    },
    {
      "name": "Киты",
      "old_id": 272,
      "new_id": 1586,
    },
    {
      "name": "Prostovcash",
      "old_id": 165,
      "new_id": 1522,
    },
    {
      "name": "Cryptonet",
      "old_id": 271,
      "new_id": 1417,
    },
    {
      "name": "JetMonet",
      "old_id": 170,
      "new_id": 1463,
    },
    {
      "name": "X-obmen",
      "old_id": 207,
      "new_id": 1576,
    },
    {
      "name": "1Mile",
      "old_id": 184,
      "new_id": 1328,
    },
    {
      "name": "Instacrypt",
      "old_id": 188,
      "new_id": 1460,
    },
    {
      "name": "StoreBucks",
      "old_id": 230,
      "new_id": 1536,
    },
    {
      "name": "0XBC1",
      "old_id": 171,
      "new_id": 1323,
    },
    {
      "name": "UltraChange",
      "old_id": 209,
      "new_id": 1555,
    },
    {
      "name": "LetsChange",
      "old_id": 194,
      "new_id": 1469,
    },
    {
      "name": "Swap-Line",
      "old_id": 255,
      "new_id": 1543,
    },
    {
      "name": "MisterBit",
      "old_id": 195,
      "new_id": 1480,
    },
    {
      "name": "BitcoinBox",
      "old_id": 254,
      "new_id": 1366,
    },
    {
      "name": "Saint.Exchange",
      "old_id": 253,
      "new_id": 1529,
    },
    {
      "name": "ABCobmen",
      "old_id": 210,
      "new_id": 1339,
    },
    {
      "name": "ExchangeMafia",
      "old_id": 214,
      "new_id": 1436,
    },
    {
      "name": "BCX Exchange",
      "old_id": 239,
      "new_id": 1358,
    },
    {
      "name": "Go-Go",
      "old_id": 200,
      "new_id": 1451,
    },
    {
      "name": "bitcash",
      "old_id": 215,
      "new_id": 1365,
    },
    {
      "name": "24PayBank",
      "old_id": 216,
      "new_id": 1331,
    },
    {
      "name": "ArmChange",
      "old_id": 208,
      "new_id": 1352,
    },
    {
      "name": "Monopriz",
      "old_id": 218,
      "new_id": 1490,
    },
    {
      "name": "Cinus Exchange",
      "old_id": 251,
      "new_id": 1393,
    },
    {
      "name": "N-Obmen",
      "old_id": 219,
      "new_id": 1501,
    },
    {
      "name": "Exdex",
      "old_id": 224,
      "new_id": 1438,
    },
    {
      "name": "BAKSTER",
      "old_id": 248,
      "new_id": 1357,
    },
    {
      "name": "Ukr-obmen",
      "old_id": 227,
      "new_id": 1554,
    },
    {
      "name": "Лимончик",
      "old_id": 232,
      "new_id": 1588,
    },
    {
      "name": "MoonLight",
      "old_id": 247,
      "new_id": 1491,
    },
    {
      "name": "Force",
      "old_id": 235,
      "new_id": 1444,
    },
    {
      "name": "FloatChange",
      "old_id": 244,
      "new_id": 1443,
    },
    {
      "name": "CryptoVortex",
      "old_id": 69,
      "new_id": 1419,
    },
    {
      "name": "Sharks.Exchange",
      "old_id": 243,
      "new_id": 1530,
    },
    {
      "name": "YesObmen",
      "old_id": 50,
      "new_id": 1579,
    },
    {
      "name": "MafinCash",
      "old_id": 240,
      "new_id": 1474,
    },
    {
      "name": "1WM",
      "old_id": 151,
      "new_id": 1329,
    }
  ]