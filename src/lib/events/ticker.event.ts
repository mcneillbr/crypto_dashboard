export interface TickerDto {
  eventType: string;
  eventTime: number;
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  weightedAveragePrice: number;
  firstTrade: number;
  lastPrice: number;
  lastQuantity: number;
  bestBidPrice: number;
  bestBidQuantity: number;
  bestAskPrice: number;
  bestAskQuantity: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  totalTradedBaseAssetVolume: number;
  totalTradedQuoteAssetVolume: number;
  statisticsOpenTime: number;
  statisticsCloseTime: number;
  firstTradeId: number;
  lastTradeId: number;
  totalNumberTrades: number;
}

export class TickerEventFactory {
  static fromDto(dto: TickerDto): TickerEvent {
    return new TickerEvent(
      dto.symbol,
      new Date(dto.eventTime),
      dto.lastPrice,
      dto.openPrice,
      dto.highPrice,
      dto.lowPrice,
    );
  }

  static fromRaw(raw: any): TickerEvent {
    return TickerEventFactory.fromDto(TickerEventFactory.mapper(raw));
  }

  public static mapper(event: any): TickerDto {
    const {
      e: eventType,
      E: eventTime,
      s: symbol,
      p: priceChange,
      P: priceChangePercent,
      w: weightedAveragePrice,
      x: firstTrade,
      c: lastPrice,
      Q: lastQuantity,
      b: bestBidPrice,
      B: bestBidQuantity,
      a: bestAskPrice,
      A: bestAskQuantity,
      o: openPrice,
      h: highPrice,
      l: lowPrice,
      v: totalTradedBaseAssetVolume,
      q: totalTradedQuoteAssetVolume,
      O: statisticsOpenTime,
      C: statisticsCloseTime,
      F: firstTradeId,
      L: lastTradeId,
      n: totalNumberTrades,
    } = event;

    return {
      eventType,
      eventTime,
      symbol,
      priceChange: parseFloat(priceChange),
      priceChangePercent: parseFloat(priceChangePercent),
      weightedAveragePrice: parseFloat(weightedAveragePrice),
      firstTrade: parseFloat(firstTrade),
      lastPrice: parseFloat(lastPrice),
      lastQuantity: parseFloat(lastQuantity),
      bestBidPrice: parseFloat(bestBidPrice),
      bestBidQuantity: parseFloat(bestBidQuantity),
      bestAskPrice: parseFloat(bestAskPrice),
      bestAskQuantity: parseFloat(bestAskQuantity),
      openPrice: parseFloat(openPrice),
      highPrice: parseFloat(highPrice),
      lowPrice: parseFloat(lowPrice),
      totalTradedBaseAssetVolume: parseInt(totalTradedBaseAssetVolume),
      totalTradedQuoteAssetVolume: parseInt(totalTradedQuoteAssetVolume),
      statisticsOpenTime: parseInt(statisticsOpenTime, 10),
      statisticsCloseTime: parseInt(statisticsCloseTime, 10),
      firstTradeId: parseInt(firstTradeId, 10),
      lastTradeId: parseInt(lastTradeId, 10),
      totalNumberTrades: parseInt(totalNumberTrades, 10),
    };
  }
}

export class TickerEvent {
  constructor(
    public readonly symbol: string,
    public readonly eventTime: Date,
    public readonly lastPrice: number,
    public readonly openPrice: number,
    public readonly highPrice: number,
    public readonly lowPrice: number,
  ) {}
}
