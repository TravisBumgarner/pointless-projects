import fs from 'fs';
import config from '../singletons/config';

class Log {
    private logStream: fs.WriteStream;

    constructor() {
        const dir = config.logPath.split('/').slice(0, -1).join('/');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        this.logStream = fs.createWriteStream(config.logPath, {
            flags: 'a'
        });
    }

    write(message: string) {
        this.logStream.write(`${new Date().toISOString()} ${message}\n`);
    }
}

export default new Log();