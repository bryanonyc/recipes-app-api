import { Request, Response } from "express";
import { logEvents } from "./logger";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (err: Error, req: Request, res: Response) => {
    logEvents(`${err.name}: \t
        ${err.message}\t
        ${req.method}\t
        ${req.url}\t
        ${req.headers.origin}`, 'errors.log'
    );

    let errorMessage;
    if (err instanceof PrismaClientKnownRequestError) {
        errorMessage = err.meta;
    } else {
        errorMessage = err.message;
    }

    const status = res.statusCode ? res.statusCode : 500;
    res
        .status(status)
        .json({ message: errorMessage, isError: true });
}

export const handleError = (req: any, res: any, error: any) => {
    errorHandler(error, req, res);
    // logEvents(`${error.name}: \t
    //     ${error.message}\t
    //     ${req.method}\t
    //     ${req.url}\t
    //     ${req.headers.origin}`, 'errors.log'
    // );
    // let errorMessage;
    // if (error instanceof PrismaClientKnownRequestError) {
    //     errorMessage = error.meta;
    // } else {
    //     errorMessage = error.message;
    // }
    // res
    //     .status(500)
    //     .json({ message: errorMessage });
};
