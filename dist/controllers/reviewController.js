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
exports.getSingleProductReviews = exports.deleteReview = exports.updateReview = exports.getSingleReview = exports.getAllReviews = exports.createReview = void 0;
const Review_1 = require("../models/Review");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const Product_1 = require("../models/Product");
const utils_1 = require("../utils");
const createReview = ({ body, user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product: productId } = body;
    const isValidProduct = yield Product_1.Product.findById(productId);
    if (!isValidProduct)
        throw new errors_1.BadRequestError(`No product with id: ${productId}`);
    // check if user already left a review for specified product (in-controller version as opposed to mongoose schema index methods)
    const hasAlreadyReviewed = yield Review_1.Review.findOne({
        product: productId,
        user: userId,
    });
    if (hasAlreadyReviewed)
        throw new errors_1.BadRequestError(`User has already reviewed product with id: ${productId}`);
    //
    const review = yield Review_1.Review.create(Object.assign(Object.assign({}, body), { user: userId }));
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
});
exports.createReview = createReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.Review.find({})
        .populate({
        path: "product",
        select: "name company price",
    })
        .populate({ path: "user", select: "name email" });
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: reviews.length, reviews });
});
exports.getAllReviews = getAllReviews;
const deleteReview = ({ user, params: { id: reviewId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const candidateReview = yield Review_1.Review.findById(reviewId);
    if (!candidateReview)
        throw new errors_1.BadRequestError(`No review with id ${reviewId}`);
    (0, utils_1.checkPermissions)(user, candidateReview.user.toString());
    yield candidateReview.deleteOne();
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: "review deleted successfully!" });
});
exports.deleteReview = deleteReview;
const updateReview = ({ params: { id: reviewId }, user, body: { rating, title, comment } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const candidateReview = yield Review_1.Review.findById(reviewId);
    if (!candidateReview)
        throw new errors_1.BadRequestError(`No review with id ${reviewId}`);
    (0, utils_1.checkPermissions)(user, candidateReview.user.toString());
    candidateReview.rating = rating;
    candidateReview.title = title;
    candidateReview.comment = comment;
    yield candidateReview.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ review: candidateReview });
});
exports.updateReview = updateReview;
const getSingleReview = ({ params: { id: reviewId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.Review.findById(reviewId);
    if (!review)
        throw new errors_1.BadRequestError(`No review with id ${reviewId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
});
exports.getSingleReview = getSingleReview;
const getSingleProductReviews = ({ params: { id: productId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.Review.find({ product: productId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: reviews.length, reviews });
});
exports.getSingleProductReviews = getSingleProductReviews;
