"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = exports.authenticateUser = void 0;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../errors");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.signedCookies.token)
        throw new errors_1.UnauthenticatedError("Authentication invalid");
    try {
        const { userId, role, name } = (0, jwt_1.isTokenValid)(req.signedCookies.token);
        // Attach the user and his permissions to the req object
        req.user = {
            userId,
            role,
            name,
        };
        next();
    }
    catch (error) {
        throw new errors_1.UnauthenticatedError("Authentication invalid");
    }
});
exports.authenticateUser = authenticateUser;
const authorizePermissions = (...allowedRoles) => ({ user: { role } }, res, next) => {
    if (!allowedRoles.includes(role))
        throw new errors_1.UnauthorizedError("Access Forbiden");
    next();
};
exports.authorizePermissions = authorizePermissions;
