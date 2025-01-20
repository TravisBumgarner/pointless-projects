import { PointMap } from "../types";

export enum SSEMessageType {
    Paint = 'p',
    System = 's',
    Auth = 'a',
    Queue = 'q',
    UserInfo = 'u'
}

export type PaintMessage = {
    t: SSEMessageType.Paint;
    p: PointMap;
    q: number;
}

export type AuthMessage = {
    t: SSEMessageType.Auth;
    m: string;
}

enum ConnectionStatus {
    Connected = "c",
    Disconnected = "d"
}

export type QueueMessage = {
    t: SSEMessageType.Queue;
    m: number;
}

export type SystemMessage = {
    t: SSEMessageType.System;
    m: ConnectionStatus;
}

export type UserInfoMessage = {
    t: SSEMessageType.UserInfo;
    m: string;
}

export type SSEMessage = PaintMessage | AuthMessage | SystemMessage | QueueMessage | UserInfoMessage;