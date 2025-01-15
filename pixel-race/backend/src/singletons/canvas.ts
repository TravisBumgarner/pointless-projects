class Canvas {
    private static instance: Canvas;
    data: Record<string, string> = {};

    private constructor() {}

    public static getInstance(): Canvas {
        if (!Canvas.instance) {
            Canvas.instance = new Canvas();
        }
        return Canvas.instance;
    }

    public update(points: [number, string][]) {
        points.forEach(([index, color]) => {
            this.data[index] = color;
        });
    }

    public getCanvas() {
        return this.data;
    }
}

export default Canvas;

