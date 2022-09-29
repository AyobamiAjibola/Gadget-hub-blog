import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken'
import { FORBIDDEN } from '../constants/response-codes';
import AppError from '../utils/appError';

export const authorize = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(
        new AppError("Your are not logged in, please log in to get access", 401)
        );
    }

    try {
        const data = JWT.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            user: string,
            admin: boolean,
            role: string
        };
        req.user = data.user;
        req.admin = data.admin;
        req.role = data.role;
        next()
    } catch (error: any) {
        return res.status(FORBIDDEN).json({
            status: "failed",
            message: "Unauthorized",
            data: []
        });
    }
};

export const authorizeandverified = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authorize(req, res, () => {
        if (req.user === req.params.id || req.admin === true) {
            next();
          } else {
            return res.status(FORBIDDEN).json({
                status: "failed",
                message: "You are not allowed to do that!",
                data: []
            });
          }
    })
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authorize(req, res, () => {
        if (req.user && req.admin === true && req.role === 'admin') {
            next();
          } else {
            return res.status(FORBIDDEN).json({
                status: "failed",
                message: "You are not allowed to do that!",
                data: []
            });
          }
    })
};

export const otherUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authorize(req, res, () => {
        if (req.user && req.admin === true && req.role !== 'admin') {
            next();
          } else {
            return res.status(FORBIDDEN).json({
                status: "failed",
                message: "You are not allowed to do that!",
                data: []
            });
          }
    })
};

export const verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authorize(req, res, () => {
        if (req.user && req.admin === true && (req.role === 'admin' || req.role !== 'admin')) {
            next();
          } else {
            return res.status(FORBIDDEN).json({
                status: "failed",
                message: "You are not allowed to do that!",
                data: []
            });
          }
    })
};



