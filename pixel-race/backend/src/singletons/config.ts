import dotenv from 'dotenv';
import z from 'zod';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'production'}` });


class Config {
    public logPath: string;

    constructor() {
        const { logPath } = this.validate();
        this.logPath = logPath;
    }

    validate(){
        const schema = z.object({
            LOG_PATH: z.string()
        });

        const result = schema.safeParse(process.env);

        if (!result.success) {
            console.error('Invalid environment variables:', result.error.format());
            process.exit(1);
        }

        return {
            logPath: result.data.LOG_PATH
        }
    }
}

export default new Config();