export * from './types';

export const PAINTING_TIME_MS = 5_000;
export const MAX_PAINT_POINTS = 5;  

export const CANVAS_GRID_SIZE = 10;
export const CANVAS_WIDTH_PIXELS = 500;
export const CANVAS_HEIGHT_PIXELS = 500;

export enum ErrorType {
    ConnectionError = "ConnectionError",
    RateLimitError = "RateLimitError",
    UnknownError = "UnknownError"
}