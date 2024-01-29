"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const orderController_1 = require("../controllers/orderController");
const full_auth_1 = require("../middleware/full-auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.orderRouter = router;
router
    .route("/")
    .get((0, full_auth_1.authorizePermissions)("admin"), orderController_1.getAllOrders)
    .post(orderController_1.createOrder);
router.route("/showAllMyOrders").get(orderController_1.getCurrentUserOrders);
router.route("/:id").get(orderController_1.getSingleOrder).patch(full_auth_1.authenticateUser, orderController_1.updateOrder);
