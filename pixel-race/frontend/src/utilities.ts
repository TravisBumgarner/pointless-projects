import { CANVAS_GRID_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from "./consts";
import { ColorKey, EncodedPoint, Point } from "./types";

export const decodePoints = (data: Record<string, string>): Point[] => {
    const rows = CANVAS_HEIGHT / CANVAS_GRID_SIZE;
    const cols = CANVAS_WIDTH / CANVAS_GRID_SIZE;

    return Object.entries(data).map(([index, color]) => ({
        x: parseInt(index) % cols * CANVAS_GRID_SIZE,
        y: Math.floor(parseInt(index) / rows) * CANVAS_GRID_SIZE,
        colorKey: color as ColorKey
    }));
}

export const encodePoints = (points: Point[]) => {
    const cols = CANVAS_WIDTH / CANVAS_GRID_SIZE;   

    return points.map((point) => {
        const index = Math.floor(point.y / CANVAS_GRID_SIZE) * cols + Math.floor(point.x / CANVAS_GRID_SIZE);
        const encodedPoint: EncodedPoint = `${index}_${point.colorKey}` 
        return encodedPoint;
    });
}
