"use client";
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib";
import { TickerEvent } from "@/lib/events";
import { WebSocketClient } from "@/services";
import { update as CryptocurrencyPriceUpdate } from "@/lib/store/slices/";
import Card from "./../components/card.component";

const host = "wss://stream.binance.com:9443";
const streamNames = [
  "btcusdt@ticker",
  "ethusdt@ticker",
  "solusdt@ticker",
  "dogeusdt@ticker",
];
const socketCli = WebSocketClient.getInstance({ host, streamNames });

export default function CardContainer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = (event: TickerEvent) => {
      dispatch(
        CryptocurrencyPriceUpdate({
          streamName: event.symbol.toLocaleLowerCase(),
          price: event.lastPrice,
          eventTime: event.eventTime.getTime(),
        }),
      );
    };
    socketCli.addEventListener(handler);

    return () => {
      socketCli.removeEventListener(handler);
    };
  });

  const cryptoCurrencyPriceList = useAppSelector(
    (state) => state.cryptoCurrencyPriceListReducer,
  );
  return (
    <div className="container flex flex-row flex-wrap content-center items-center justify-evenly">
      {cryptoCurrencyPriceList.map((cryptoCurrencyPrice) => (
        <Card
          key={cryptoCurrencyPrice.streamName}
          cryptoCurrencyPrice={cryptoCurrencyPrice}
        />
      ))}
    </div>
  );
}
