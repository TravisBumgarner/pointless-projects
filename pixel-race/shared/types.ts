type UPPER_CHAR = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
type LOWER_CHAR = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
type NUMBER = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type ColorKey = UPPER_CHAR | LOWER_CHAR | NUMBER;
export type PointEncoded = `${number}_${ColorKey}`;

export enum SSEMessageType {
    Paint = 'p',
    System = 's',
    Auth = 'a',
    Queue = 'q',
    UserInfo = 'u'
}

export type PaintMessage = {
    t: SSEMessageType.Paint;
    p: PointEncoded[];
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