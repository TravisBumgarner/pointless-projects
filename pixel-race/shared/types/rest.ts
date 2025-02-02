import { ErrorType, PointMap } from "..";

export type QueuePostRequest = {
    clientId: string;
}


export type ErrorResponse = {
    error: ErrorType
}

export type InitResponse = {
    canvas: PointMap,
    queue: number
}

export type PostPaintResponse = {
    success: boolean
}

export type QueuePostResponse = {
    queueSize: number;
}

export type RestRequest = QueuePostRequest;
export type RestResponse = QueuePostResponse;