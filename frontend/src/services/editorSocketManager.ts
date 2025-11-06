/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT(model: GPT 5.0), date: 2025-10-31
 * Purpose: To understand how to create a singleton class that manages websocket connection
 * Author Review: I validated correctness, security, and performance of the method suggested and modified areas such as instance
 * methods and variable naming
 */

import ReconnectingWebSocket from "reconnecting-websocket";

//Singleton class so that client has at most ONE socket connection at all times
class WebSocketManager {
  private socket: ReconnectingWebSocket | null = null;
  private static instance: WebSocketManager;
  private lastPing: number = 0;

  private constructor() {}

  static getInstance() {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }
  connect(url: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return this.socket;
    }

    this.socket = new ReconnectingWebSocket(url);
    this.socket.binaryType = "arraybuffer";
    this.lastPing = Date.now();
    console.log("Websocket connected to server");
    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  getTime() {
    return this.lastPing;
  }
  setTime() {
    this.lastPing = Date.now();
  }

  close() {
    if (this.socket) {
      this.socket.close();
      console.log("does this run ");
      this.socket = null;
      this.lastPing = 0;
    }
  }
}

export const editorWebSocketManager = WebSocketManager.getInstance();
