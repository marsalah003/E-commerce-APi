"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const productController_1 = require("../controllers/productController");
const reviewController_1 = require("../controllers/reviewController");
const full_auth_1 = require("../middleware/full-auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.productRouter = router;
router
    .route("/")
    .get(productController_1.getAllProducts)
    .post([full_auth_1.authenticateUser, (0, full_auth_1.authorizePermissions)("admin")], productController_1.createProduct);
router
    .route("/uploadImage")
    // @ts-expect-error just testing
    .post([full_auth_1.authenticateUser, (0, full_auth_1.authorizePermissions)("admin")], productController_1.uploadImage);
router
    .route("/:id")
    .get(productController_1.getSingleProduct)
    .delete([full_auth_1.authenticateUser, (0, full_auth_1.authorizePermissions)("admin")], productController_1.deleteProduct)
    .patch([full_auth_1.authenticateUser, (0, full_auth_1.authorizePermissions)("admin")], productController_1.updateProduct);
router.route("/:id/reviews").get(reviewController_1.getSingleProductReviews);
