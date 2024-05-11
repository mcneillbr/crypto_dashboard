"use client";
import React from "react";
import { CryptoCurrencyPrice, MoveStockPrice } from "@/lib/store/slices";

type CardProp = {
  cryptoCurrencyPrice: CryptoCurrencyPrice;
};

export default function Card({ cryptoCurrencyPrice }: CardProp) {
  const isMoveStockPriceDown =
    cryptoCurrencyPrice.moveStockPrice == MoveStockPrice.DOWN;

  return (
    <div
      role="card"
      className="m-2 p-1 flex flex-col flex-nowrap min-w-72 bg-gray-50 drop-shadow-xl"
    >
      <div role="card-content" className="m-2 p-3 bg-white">
        <div role="card-heading" className="flex flex-row w-full">
          <h3 className="text-2xl">
            {cryptoCurrencyPrice.crypto.name}&nbsp;/&nbsp;
          </h3>
          <h3 className="text-2xl">{cryptoCurrencyPrice.pair.name}</h3>
        </div>
        <div role="card-body" className="flex flex-row mt-6 p-1 px-2">
          <h3 className="text-left p-2 px-3 text-3xl grow">
            {cryptoCurrencyPrice.priceCurrency}
          </h3>
          <div className="m-1 grow-0 ">
            <span
              className={`text-xs text-center mt-1 mr-2 p-1 rounded-md ${
                isMoveStockPriceDown ? "bg-red-500" : "bg-green-300"
              } ${isMoveStockPriceDown ? "text-white" : "text-black"}`}
            >
              {cryptoCurrencyPrice.pricePercent}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
