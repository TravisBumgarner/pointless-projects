const encodePoints = (data: Record<string, string>) => {
    return Object.entries(data).map(([index, color]) => `${index}_${color}`);
}

export class Canvas {
    data: Record<string, string> = {};

    public update(points: [number, string][]) {
        points.forEach(([index, color]) => {
            this.data[index] = color;
        });
    }

    public getCanvas(encode: boolean = true) {
        return encode ? encodePoints(this.data) : this.data;
    }
}

export const canvas = new Canvas();
