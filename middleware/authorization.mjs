import jwt from 'jsonwebtoken';
import User from '../models/UserModel.mjs';
import { asyncHandler } from './asyncHandler.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';

// Requires the user to be authenticated
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // KEEP THIS deactivated until POSTMAN han confirmed that it works
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    if (!token) {
        next(new ErrorResponse('Not authorized!', 401));

    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id);

    if (!req.user) {
        next(new ErrorResponse('Not authorized!', 401));
    }
    next();
});

// Authorize roles: admin, user, manager
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: `The role ${req.user.role} has no authorization`
            })
        }
        next();
    };
};