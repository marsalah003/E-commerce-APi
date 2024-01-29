"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const authController_1 = require("../controllers/authController");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.route("/register").post(authController_1.register);
router.route("/login").post(authController_1.login);
router.route("/logout").get(authController_1.logout);
