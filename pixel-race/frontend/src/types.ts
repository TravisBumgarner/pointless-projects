import { ColorKey } from "../../shared/types";

export type PointXY = {
    x: number;
    y: number;
    colorKey: ColorKey;
}

export enum EventType {    
    Paint = 'paint',
}

type PaintEvent = {
    points: PointXY[];
    queue: number;
    type: EventType.Paint;
}

export type Event = PaintEvent;

