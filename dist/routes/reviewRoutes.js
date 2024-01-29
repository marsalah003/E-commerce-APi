"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const reviewController_1 = require("../controllers/reviewController");
const full_auth_1 = require("../middleware/full-auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.reviewRouter = router;
router.route("/").get(reviewController_1.getAllReviews).post(full_auth_1.authenticateUser, reviewController_1.createReview);
router
    .route("/:id")
    .get(reviewController_1.getSingleReview)
    .delete(full_auth_1.authenticateUser, reviewController_1.deleteReview)
    .patch(full_auth_1.authenticateUser, reviewController_1.updateReview);
