"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const errors_1 = require("../errors");
const checkPermissions = ({ userId, role }, resourceUserId) => {
    if (userId === resourceUserId || role === "admin")
        return;
    throw new errors_1.UnauthorizedError("user is not authorised to access this route");
};
exports.checkPermissions = checkPermissions;
