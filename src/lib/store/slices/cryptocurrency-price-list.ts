import ms from "ms";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { numberToUsd, toOptionalFixed } from "@/lib/helpers";

export type CryptoCurrency = {
  name: string;
  symbol: string;
};

export enum MoveStockPrice {
  UP = 1,
  DOWN = 2,
  NEUTRAL = 3,
}

export type CryptoCurrencyPrice = {
  crypto: CryptoCurrency;
  pair: CryptoCurrency;
  streamName: string;
  price: number;
  priceCurrency: string;
  pricePercent: string;
  moveStockPrice: MoveStockPrice;
  fixedPointNotation: number;
  statistics: {
    priceUpdateInterval: number; // millisecond's
    prices: {
      price: number;
      priceCurrency: string;
      lastModified: number;
    }[];
  };
  lastModified: number;
};

const PRICE_UPDATE_INTERVAL = ms("1m");
const CRYPTO_CURRENCY_PRICE_DATE = new Date().getTime();
const MAXIMUM_PRICE_LIST_SIZE = 100;

const initialState: CryptoCurrencyPrice[] = [
  {
    crypto: { name: "Bitcoin", symbol: "BTC" },
    pair: { name: "Tether", symbol: "USDT" },
    streamName: "btcusdt",
    price: 0,
    priceCurrency: "$0",
    pricePercent: "0%",
    moveStockPrice: MoveStockPrice.NEUTRAL,
    fixedPointNotation: 2,
    statistics: {
      priceUpdateInterval: PRICE_UPDATE_INTERVAL,
      prices: [],
    },
    lastModified: CRYPTO_CURRENCY_PRICE_DATE,
  },
  {
    crypto: { name: "Ethereum", symbol: "ETH" },
    pair: { name: "Tether", symbol: "USDT" },
    streamName: "ethusdt",
    price: 0,
    priceCurrency: "$0",
    pricePercent: "0%",
    moveStockPrice: MoveStockPrice.NEUTRAL,
    fixedPointNotation: 2,
    statistics: {
      priceUpdateInterval: PRICE_UPDATE_INTERVAL,
      prices: [],
    },
    lastModified: CRYPTO_CURRENCY_PRICE_DATE,
  },
  {
    crypto: { name: "Solana", symbol: "SOL" },
    pair: { name: "Tether", symbol: "USDT" },
    streamName: "solusdt",
    price: 0,
    priceCurrency: "$0",
    pricePercent: "0%",
    moveStockPrice: MoveStockPrice.NEUTRAL,
    fixedPointNotation: 2,
    statistics: {
      priceUpdateInterval: PRICE_UPDATE_INTERVAL,
      prices: [],
    },
    lastModified: CRYPTO_CURRENCY_PRICE_DATE,
  },
  {
    crypto: { name: "Dogecoin", symbol: "DOGE" },
    pair: { name: "Tether", symbol: "USDT" },
    streamName: "dogeusdt",
    price: 0,
    priceCurrency: "$0",
    pricePercent: "0%",
    moveStockPrice: MoveStockPrice.NEUTRAL,
    fixedPointNotation: 10,
    statistics: {
      priceUpdateInterval: PRICE_UPDATE_INTERVAL,
      prices: [],
    },
    lastModified: CRYPTO_CURRENCY_PRICE_DATE,
  },
];

function updatePriceStatistics(
  cryptoCurrencyPrice: CryptoCurrencyPrice,
  price: number,
  eventTime: number,
): void {
  const pricesSize = cryptoCurrencyPrice.statistics.prices.length;

  if (pricesSize === 0) {
    cryptoCurrencyPrice.statistics.prices.push({
      price,
      priceCurrency: numberToUsd(price),
      lastModified: eventTime,
    });

    return;
  }

  // reduce graphics memory consumption
  if (pricesSize >= MAXIMUM_PRICE_LIST_SIZE) {
    cryptoCurrencyPrice.statistics.prices =
      cryptoCurrencyPrice.statistics.prices.splice(0, 1);
  }

  const [lastPrice] = cryptoCurrencyPrice.statistics.prices.slice(-1);

  const lastModified = new Date(lastPrice.lastModified);

  const diff: number = eventTime - lastModified.getTime();

  if (diff >= cryptoCurrencyPrice.statistics.priceUpdateInterval) {
    cryptoCurrencyPrice.statistics.prices.push({
      price,
      priceCurrency: numberToUsd(price),
      lastModified: eventTime,
    });
  }
}

function getPriceMoveStockByPrice(price: number): MoveStockPrice {
  if (price > 0.0) {
    return MoveStockPrice.UP;
  } else if (price < 0.0) {
    return MoveStockPrice.DOWN;
  }

  return MoveStockPrice.NEUTRAL;
}

function updateCryptoCurrencyPrice(
  cryptoCurrencyPrice: CryptoCurrencyPrice,
  newPrice: number,
): void {
  cryptoCurrencyPrice.price = newPrice;

  cryptoCurrencyPrice.priceCurrency = numberToUsd(newPrice);

  const [lastPrice] = cryptoCurrencyPrice.statistics.prices;

  const priceChanged = lastPrice
    ? (cryptoCurrencyPrice.price / lastPrice.price - 1) * 100
    : 0;

  cryptoCurrencyPrice.moveStockPrice = getPriceMoveStockByPrice(priceChanged);

  cryptoCurrencyPrice.pricePercent = `${toOptionalFixed(priceChanged, 2)}%`;
}

export const CryptoCurrencyPriceListSlice = createSlice({
  name: "CryptoCurrencyPriceList",
  initialState,
  reducers: {
    add: (
      state: CryptoCurrencyPrice[],
      action: PayloadAction<CryptoCurrencyPrice>,
    ) => {
      state.push(action.payload);
    },
    remove: (
      state: CryptoCurrencyPrice[],
      action: PayloadAction<CryptoCurrencyPrice>,
    ) => {
      const index = state.findIndex(
        (value) => (value.crypto.name = action.payload.crypto.name),
      );
      state.splice(index, 1);
    },
    update: (
      state: CryptoCurrencyPrice[],
      action: PayloadAction<
        Pick<CryptoCurrencyPrice, "streamName" | "price"> & {
          eventTime: number;
        }
      >,
    ) => {
      const cryptoCurrencyPrice = state.find(
        (value) => value.streamName === action.payload.streamName,
      );

      if (cryptoCurrencyPrice) {
        updatePriceStatistics(
          cryptoCurrencyPrice,
          action.payload.price,
          action.payload.eventTime,
        );

        updateCryptoCurrencyPrice(cryptoCurrencyPrice, action.payload.price);

        cryptoCurrencyPrice.lastModified = new Date().getTime();
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, update, remove } = CryptoCurrencyPriceListSlice.actions;

export default CryptoCurrencyPriceListSlice.reducer;
