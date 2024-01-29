"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenUser = void 0;
const createTokenUser = (user) => {
    return {
        role: user.role,
        name: user.name,
        userId: user._id.toString(),
    };
};
exports.createTokenUser = createTokenUser;
