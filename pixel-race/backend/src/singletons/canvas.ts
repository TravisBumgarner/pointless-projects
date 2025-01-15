export class Canvas {
    data: Record<string, string> = {};

    public update(points: [number, string][]) {
        points.forEach(([index, color]) => {
            this.data[index] = color;
        });
    }

    public getCanvas() {
        return this.data;
    }
}

export const canvas = new Canvas();
