import { CANVAS_GRID_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from "./consts";
import { Point } from "./types";

export const decodePoints = (data: Record<string, string>): Point[] => {
    const rows = CANVAS_HEIGHT / CANVAS_GRID_SIZE;
    const cols = CANVAS_WIDTH / CANVAS_GRID_SIZE;

    return Object.entries(data).map(([index, color]) => ({
        x: parseInt(index) % cols * CANVAS_GRID_SIZE,
        y: Math.floor(parseInt(index) / rows) * CANVAS_GRID_SIZE,
        color: color
    }));
}

export const encodePoints = (points: Point[]) => {
    const cols = CANVAS_WIDTH / CANVAS_GRID_SIZE;   

    return points.reduce((acc, point) => {
        const index = Math.floor(point.y / CANVAS_GRID_SIZE) * cols + Math.floor(point.x / CANVAS_GRID_SIZE);
        acc[index] = point.color;
        return acc;
    }, {} as Record<number, string>);
}
