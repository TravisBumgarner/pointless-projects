import { PointEncoded } from "../../../shared";

const encodePoints = (data: Record<string, string>) => {
    return Object.entries(data).map(([index, color]) => `${index}_${color}`);
}

const decodePoints = (encodedPoints: string[]): [number, string][] => {
    return encodedPoints.map((encodedPoint) => {
      const [index, colorKey] = encodedPoint.split("_");
      return [parseInt(index), colorKey];
    });
  };

export class Canvas {
    data: Record<string, string> = {};

    public update(points: PointEncoded[]) {
        const decodedPoints = decodePoints(points);
        decodedPoints.forEach(([index, color]) => {
            this.data[index] = color;
        });
    }

    public getCanvas() {
        return encodePoints(this.data);
    }
}

export const canvas = new Canvas();
