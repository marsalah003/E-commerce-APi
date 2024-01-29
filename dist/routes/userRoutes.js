"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const full_auth_1 = require("../middleware/full-auth");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
exports.userRouter = router;
router.route("/").get((0, full_auth_1.authorizePermissions)("admin"), userController_1.getAllUsers);
router.route("/showMe").get(userController_1.showCurrentUser);
router.route("/updateUser").patch(userController_1.updateUser);
router.route("/updateUserPassword").patch(userController_1.updateUserPassword);
router.route("/:id").get(userController_1.getSingleUser);
