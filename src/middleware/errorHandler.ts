import { Request, Response } from "express";
import { logEvents } from "./logger";

export const errorHandler = (err: Error, req: Request, res: Response, next: Function) => {
    logEvents(`${err.name}: \t
        ${err.message}\t
        ${req.method}\t
        ${req.url}\t
        ${req.headers.origin}`, 'errors.log'
    );
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500;
    res
        .status(status)
        .json({ message: err.message, isError: true });
}
