import { Request, Response } from "express";
import { logEvents } from "./logger";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

export const errorHandler = (err: Error, req: Request, res: Response, next: Function) => {
    logEvents(`${err.name}: \t
        ${err.message}\t
        ${req.method}\t
        ${req.url}\t
        ${req.headers.origin}`, 'errors.log'
    );

    const status = res.statusCode ? res.statusCode : 500;
    res
        .status(status)
        .json({ message: err.message, isError: true });
}

export const handleError = (req: any, res: any, error: any) => {
    logEvents(`${error.name}: \t
        ${error.message}\t
        ${req.method}\t
        ${req.url}\t
        ${req.headers.origin}`, 'errors.log'
    );
    let errorMessage;
    if (error instanceof PrismaClientKnownRequestError) {
        errorMessage = error.meta;
    } else if (error instanceof PrismaClientUnknownRequestError) {
        errorMessage = error.message;
    } else if (error instanceof PrismaClientValidationError) {
        errorMessage = error.message;
    }
    res
        .status(500)
        .send(errorMessage);
};
