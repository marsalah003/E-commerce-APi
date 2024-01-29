"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesToResponse = exports.isTokenValid = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const isTokenValid = (candidateToken) => {
    const { JWT_SECRET } = process.env;
    const decoded = (0, jsonwebtoken_1.verify)(candidateToken, JWT_SECRET);
    return decoded;
};
exports.isTokenValid = isTokenValid;
const generateToken = (payload) => {
    const { JWT_SECRET, JWT_LIFETIME } = process.env;
    const token = (0, jsonwebtoken_1.sign)(payload, JWT_SECRET, {
        expiresIn: JWT_LIFETIME,
    });
    return token;
};
exports.generateToken = generateToken;
const attachCookiesToResponse = (res, tokenUser) => {
    const token = generateToken(tokenUser);
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        signed: true,
    });
};
exports.attachCookiesToResponse = attachCookiesToResponse;
