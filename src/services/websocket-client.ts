import { toast } from "react-toastify";
import { TickerEventFactory } from "@/lib/events";
import { sleepTimer } from "@/lib/helpers";
import ms from "ms";

const RECONNECT_INTERVAL: number = ms("1m");

export type WebSocketClientParams = {
  host: string;
  streamNames: string[];
};

type WebSocketRequestAction = {
  method: string;
  params?: string[];
  id: number; // response id
};

export class WebSocketClient {
  private static instance?: WebSocketClient;
  private static webSocketUri: string;
  private eventHandlers: Set<Function>;

  protected constructor(private webSocket: WebSocket) {
    this.eventHandlers = new Set();
    this.registerEvents();
  }

  public static getInstance({
    host,
    streamNames,
  }: WebSocketClientParams): WebSocketClient {
    if (WebSocketClient.instance) return WebSocketClient.instance;

    WebSocketClient.webSocketUri =
      host + "/stream?streams=" + streamNames.join("/");

    const webSocket = WebSocketClient.connectWebSocket();

    WebSocketClient.instance = new WebSocketClient(webSocket);

    return WebSocketClient.instance;
  }

  private static connectWebSocket(): WebSocket {
    return new WebSocket(WebSocketClient.webSocketUri);
  }

  public static async reconnectWebSocket(): Promise<void> {
    toast.warn("Offline, attempting to reconnect !", {
      position: "bottom-left",
    });

    await sleepTimer(RECONNECT_INTERVAL);

    WebSocketClient.instance?.renewWebSocket();
  }

  public renewWebSocket(): void {
    this.webSocket = WebSocketClient.connectWebSocket();
    this.registerEvents();
  }

  protected registerEvents(): void {
    this.webSocket.addEventListener("open", (event: Event) => {
      console.debug("Connecting to a server has been completed successfully.", {
        event,
      });

      toast.dismiss();

      toast.success(
        "Connecting to a server has been completed successfully !",
        {
          position: "bottom-left",
        },
      );
    });

    this.webSocket.addEventListener("message", (event: MessageEvent) => {
      const raw = JSON.parse(event.data);
      this.dispatchEvent(raw.data);
    });

    this.webSocket.addEventListener("close", (closeEvent: CloseEvent) => {
      console.debug("The connection has been closed successfully.", {
        closeEvent,
      });

      WebSocketClient.reconnectWebSocket();
    });

    this.webSocket.addEventListener("error", (event: Event) => {
      console.error("WebSocket Error", { error: event });
    });
  }

  public get isConnected(): boolean {
    return this.webSocket.readyState === WebSocket.OPEN;
  }

  public subscribeSymbol(symbols: string[]): void {
    this.send({
      method: "SUBSCRIBE",
      params: symbols,
      id: 10,
    });
  }

  public unsubscribeSymbol(symbols: string[]): void {
    this.send({
      method: "UNSUBSCRIBE",
      params: symbols,
      id: 11,
    });
  }

  public addEventListener(handler: Function) {
    this.eventHandlers.add(handler);
  }

  public removeEventListener(handler: Function): boolean {
    return this.eventHandlers.delete(handler);
  }

  public getAllSubScription(): void {
    this.send({
      method: "LIST_SUBSCRIPTIONS",
      id: 1,
    });
  }

  private send(action: WebSocketRequestAction): void {
    if (!this.isConnected) {
      throw new Error("WebSocket not connected");
    }

    this.webSocket.send(JSON.stringify(action));
  }

  close(): void {
    if (this.isConnected) this.webSocket.close();
  }

  private dispatchEvent(event: any): void {
    const tickerEvent = TickerEventFactory.fromRaw(event);
    for (let handler of this.eventHandlers) {
      handler(tickerEvent);
    }
  }
}
