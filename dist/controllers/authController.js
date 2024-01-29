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
exports.logout = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../models/User");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const register = ({ body: { name, email, password } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield User_1.User.findOne({ email });
    if (userExists)
        throw new errors_1.BadRequestError("email is already in use");
    const isFirstAccount = (yield User_1.User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";
    const user = yield User_1.User.create({ name, email, password, role });
    const tokenUser = (0, utils_2.createTokenUser)(user);
    (0, utils_1.attachCookiesToResponse)(res, tokenUser);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: tokenUser });
});
exports.register = register;
const login = ({ body: { email, password } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !password)
        throw new errors_1.BadRequestError("both email and password must be provided");
    const user = yield User_1.User.findOne({ email });
    if (!user)
        throw new errors_1.UnauthenticatedError("email was not found");
    const isPasswordValid = yield user.comparePassword(password);
    if (!isPasswordValid)
        throw new errors_1.UnauthenticatedError("password doesent match");
    const tokenUser = (0, utils_2.createTokenUser)(user);
    (0, utils_1.attachCookiesToResponse)(res, tokenUser);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", "logout", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user logged out! " });
});
exports.logout = logout;
