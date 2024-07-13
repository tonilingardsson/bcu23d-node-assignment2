import User from "../models/UserModel.mjs";
import { saveUser } from "../data/fileDb.mjs";
import { hashPassword } from "../utilities/security.mjs";
// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  PUBLIC
export const register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res
            .status(400)
            .json({
                status: false,
                statusCode: 400,
                error: 'Username, email or password missing!',
            });
    }

    const user = new User(name, email, password, role ?? 'user');
    await saveUser(user);
    res
        .status(201)
        .json({ status: true, statusCode: 201, data: user });
};

// @desc    Login a user
// @route   POST /api/v1/auth/login
// @access  PUBLIC
export const login = (req, res, next) => {
    res.status(200).json({ status: true, statusCode: 200, data: 'Login works!' });
};

// @desc    Return info about a logged in user
// @route   GET /api/v1/auth/me
// @access  PUBLIC
export const getMe = (req, res, next) => {
    res
        .status(200)
        .json({ status: true, statusCode: 200, data: 'My profile works too!' });
};