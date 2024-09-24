import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path';
import { Request, Response } from 'express';

export const logEvents = async (message: string, logfileName: string) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logfileName), logItem);
    } catch (error) {
        console.log(error);
    }
}

export const logger = (req: Request, res: Response, next: Function) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'requests.log');
    console.log(`${req.method} ${req.path}`);
    next();
};
