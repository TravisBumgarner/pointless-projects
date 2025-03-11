import fs from "fs";
import path from "path";
import { PointMap } from "../../../shared";
import config from "./config";
export class Canvas {
  data: Record<string, string> = {};

  constructor() {
    this.restore();
  }

  private backup() {
    const backup = JSON.stringify(this.data);
    fs.writeFileSync(config.backupPath, backup);
  }

  private restore() {
    if (!fs.existsSync(config.backupPath)) return;
    console.log(
      "Restoring canvas from abs path:",
      path.resolve(config.backupPath)
    );
    const backup = fs.readFileSync(config.backupPath, "utf8");
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
