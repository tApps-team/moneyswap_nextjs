import { CurrencyPair } from "@/features/currency/currency-pair";
import { cn } from "@/shared/lib";
import { ScrollArea } from "@/shared/ui";

const mockData = [
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "BTC",
      icon_url: "https://api.moneyswap.online/media/icons/valute/BTC.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHUSD",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHUSD.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 50,
  },
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHRUB",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHRUB.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "BTC",
      icon_url: "https://api.moneyswap.online/media/icons/valute/BTC.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 70,
  },
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "BTC",
      icon_url: "https://api.moneyswap.online/media/icons/valute/BTC.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHAED",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHAED_IlnL5J0.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 15,
  },
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "ETH",
      icon_url: "https://api.moneyswap.online/media/icons/valute/ETH.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHUSD",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHUSD.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 100,
  },
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "BTC",
      icon_url: "https://api.moneyswap.online/media/icons/valute/BTC.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHRUB",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHRUB.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 80,
  },
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHRUB",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHRUB.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "USDTTRC20",
      icon_url: "https://api.moneyswap.online/media/icons/valute/USDTTRC20.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 50,
  },
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHRUB",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHRUB.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "USDTTRC20",
      icon_url: "https://api.moneyswap.online/media/icons/valute/USDTTRC20.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 50,
  },
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHRUB",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHRUB.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "USDTTRC20",
      icon_url: "https://api.moneyswap.online/media/icons/valute/USDTTRC20.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 50,
  },
  {
    valute_from: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "CASHRUB",
      icon_url: "https://api.moneyswap.online/media/icons/valute/CASHRUB.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    valute_to: {
      name: {
        ru: "BTC",
        en: "BTC",
      },
      code_name: "USDTTRC20",
      icon_url: "https://api.moneyswap.online/media/icons/valute/USDTTRC20.svg",
      type_valute: {
        ru: "BTC",
        en: "BTC",
      },
    },
    pointsCount: 50,
  },
];
export const CryptoDirection = async () => {
  const maxPointsCount = Math.max(...mockData.map((item) => item.pointsCount));
  return (
    <aside className="grid grid-cols-1 grid-flow-row min-h-[36rem] max-h-[40rem] overflow-hidden  gap-4 items-start rounded-2xl  bg-[#2d2d2d] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] p-5">
      <div className="grid-cols-2 grid">
        <p className="text-sm uppercase">Направления обменника</p>
        <p className="text-xs uppercase">Количество обменных пунктов по направлению</p>
      </div>

      <ScrollArea className="h-full pr-3">
        <div className="flex flex-col gap-4 p-1">
          {mockData.map((pair) => (
            <div
              className="grid grid-cols-[0.7fr,1fr] gap-6 w-full "
              key={pair.valute_from.name.en + pair.pointsCount}
            >
              <CurrencyPair valuteFrom={pair.valute_from} valuteTo={pair.valute_to} />
              <div
                style={{
                  width: `${(pair.pointsCount / maxPointsCount) * 100}%`,
                }}
                className={cn(
                  `bg-[#606060] min-w-12 max-w-full rounded-full flex items-center justify-end px-3 ml-auto`,
                )}
              >
                <p>{pair.pointsCount}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
