export type QueuePostRequest = {
    clientId: string;
}

export type QueuePostResponse = {
    p: number | null;
}

export type RestRequest = QueuePostRequest;
export type RestResponse = QueuePostResponse;