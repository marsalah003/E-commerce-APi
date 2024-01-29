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
exports.updateUserPassword = exports.updateUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = require("../models/User");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.User.find({ role: "user" }).select("-password");
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({
        _id: req.params.id,
        role: "user",
    }).select("-password");
    if (!user)
        throw new errors_1.BadRequestError(`No user with id ${req.user.userId}`);
    (0, utils_1.checkPermissions)(req.user, user._id.toString());
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getSingleUser = getSingleUser;
const showCurrentUser = ({ user }, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.showCurrentUser = showCurrentUser;
const updateUserPassword = ({ body: { oldPassword, newPassword }, user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!oldPassword || !newPassword)
        throw new errors_1.BadRequestError("both new and old password must be provided");
    const user = (yield User_1.User.findOne({ _id: userId }));
    const isPasswordmatch = yield user.comparePassword(oldPassword);
    if (!isPasswordmatch)
        throw new errors_1.UnauthenticatedError("old password does not match users password");
    user.password = newPassword;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
});
exports.updateUserPassword = updateUserPassword;
const updateUser = ({ body: { name, email }, user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name || !email)
        throw new errors_1.BadRequestError("both a new name and email must be provided");
    const updatedUser = (yield User_1.User.findOneAndUpdate({ _id: userId }, { name, email }, {
        new: true,
        runValidators: true,
    }));
    const tokenUser = (0, utils_1.createTokenUser)(updatedUser);
    (0, utils_1.attachCookiesToResponse)(res, tokenUser);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
});
exports.updateUser = updateUser;
