import { PointMap } from "../types";

export enum SSEMessageType {
  YourTurn = "your_turn", // You are the current client
  YouAreNext = "you_are_next", // You are next in the queue
  Paint = "paint", // Client has painted
  System = "system", // System message
  Auth = "auth", // Client has authenticated with a clientId
  Queue = "queue", // Updates to queue
  UserInfo = "user_info", // User info message
}

export type PaintMessage = {
  type: SSEMessageType.Paint;
  points: PointMap;
};

export type AuthMessage = {
  type: SSEMessageType.Auth;
  clientId: string;
};

enum ConnectionStatus {
  Connected = "connected",
  Disconnected = "disconnected",
}

export type QueueMessage = {
  type: SSEMessageType.Queue;
  size: number;
  shouldAdvanceInQueue: boolean;
};

export type SystemMessage = {
  type: SSEMessageType.System;
  message: ConnectionStatus;
};

export type UserInfoMessage = {
  type: SSEMessageType.UserInfo;
  message: string;
};

export type YourTurnMessage = {
  type: SSEMessageType.YourTurn;
};

export type YouAreNextMessage = {
  type: SSEMessageType.YouAreNext;
};

export type SSEMessage =
  | PaintMessage
  | AuthMessage
  | SystemMessage
  | QueueMessage
  | UserInfoMessage
  | YourTurnMessage
  | YouAreNextMessage;
