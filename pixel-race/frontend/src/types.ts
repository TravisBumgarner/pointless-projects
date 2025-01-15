

type UPPER_CHAR = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
type LOWER_CHAR = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
type NUMBER = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type ColorKey = UPPER_CHAR | LOWER_CHAR | NUMBER;

export type Point = {
    x: number;
    y: number;
    colorKey: ColorKey;
}

export enum EventType {    
    Paint = 'paint',
}

type PaintEvent = {
    points: Point[];
    queue: number;
    type: EventType.Paint;
}

export type Event = PaintEvent;

export type EncodedPoint = `${number}_${ColorKey}`;