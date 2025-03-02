import dotenv from "dotenv";
import z from "zod";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "production"}` });

class Config {
  public logPath: string;
  public backupPath: string;
  constructor() {
    const { logPath, backupPath } = this.validate();
    this.logPath = logPath;
    this.backupPath = backupPath;
  }

  validate() {
    const schema = z.object({
      LOG_PATH: z.string(),
      BACKUP_PATH: z.string(),
    });

    const result = schema.safeParse(process.env);

    if (!result.success) {
      console.error("Invalid environment variables:", result.error.format());
      process.exit(1);
    }

    return {
      logPath: result.data.LOG_PATH,
      backupPath: result.data.BACKUP_PATH,
    };
  }
}

export default new Config();
