import { PointMap } from "../../../shared";
export class Canvas {
    data: Record<string, string> = {};

    public update(points: PointMap) {
        this.data = { ...this.data, ...points };
    }

    public getCanvas() {
        return this.data;
    }

    public clearCanvas() {
        this.data = {};
    }
}

export const canvas = new Canvas();
