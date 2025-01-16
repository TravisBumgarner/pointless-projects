import { ColorKey, PointEncoded } from "../../shared/types";
import { CANVAS_GRID_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from "./consts";
import { PointXY } from "./types";

export const decodePoints = (data: PointEncoded[]): PointXY[] => {
    console.log('dat', data);

    const rows = CANVAS_HEIGHT / CANVAS_GRID_SIZE;
    const cols = CANVAS_WIDTH / CANVAS_GRID_SIZE;

    return data.map((encodedPoint) => {
        const [index, colorKey] = encodedPoint.split('_');
        return {
            x: parseInt(index) % cols * CANVAS_GRID_SIZE,
            y: Math.floor(parseInt(index) / rows) * CANVAS_GRID_SIZE,
            colorKey: colorKey as ColorKey
        };
    });
}

export const encodePoints = (points: PointXY[]): PointEncoded[] => {
    const cols = CANVAS_WIDTH / CANVAS_GRID_SIZE;   

    return points.map((point) => {
        const index = Math.floor(point.y / CANVAS_GRID_SIZE) * cols + Math.floor(point.x / CANVAS_GRID_SIZE);
        const encodedPoint: PointEncoded = `${index}_${point.colorKey}` 
        return encodedPoint;
    });
}
