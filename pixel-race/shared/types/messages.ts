import { PointMap } from "../types";

export enum SSEMessageType {
    YourTurn = 'your_turn', // You are the current client
    Paint = 'paint', // Client has painted
    System = 'system', // System message
    Auth = 'auth', // Client has authenticated with a clientId
    Queue = 'queue', // Client has joined the queue
    UserInfo = 'user_info' // User info message
}

export type PaintMessage = {
    type: SSEMessageType.Paint;
    points: PointMap;
}

export type AuthMessage = {
    type: SSEMessageType.Auth;
    clientId: string;
}

enum ConnectionStatus {
    Connected = "connected",
    Disconnected = "disconnected"
}

export type QueueMessage = {
    type: SSEMessageType.Queue;
    size: number;
}

export type SystemMessage = {
    type: SSEMessageType.System;
    message: ConnectionStatus;
}

export type UserInfoMessage = {
    type: SSEMessageType.UserInfo;
    message: string;
}

export type YourTurnMessage = {
    type: SSEMessageType.YourTurn;
}

export type SSEMessage = PaintMessage | AuthMessage | SystemMessage | QueueMessage | UserInfoMessage | YourTurnMessage;