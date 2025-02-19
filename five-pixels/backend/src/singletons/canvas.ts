import fs from "fs";
import { PointMap } from "../../../shared";

export class Canvas {
    data: Record<string, string> = {};

    constructor() {
        this.restore();
    }

    private backup(){
        const backup = JSON.stringify(this.data);
        fs.writeFileSync("./backup.json", backup);
    }

    private restore(){
        if(!fs.existsSync("./backup.json")) return;
        const backup = fs.readFileSync("./backup.json", "utf8");
        this.data = JSON.parse(backup);
    }

    public update(points: PointMap) {
        this.data = { ...this.data, ...points };
        this.backup();
    }

    public getCanvas() {
        return this.data;
    }

    public clearCanvas() {
        this.data = {};
    }
}

export const canvas = new Canvas();
