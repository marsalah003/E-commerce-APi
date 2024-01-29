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
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const Product_1 = require("./Product");
const reviewSchema = new mongoose_1.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "a review must have a rating"],
    },
    title: {
        type: String,
        required: [true, "a review must have a title"],
        trim: true,
        maxlength: [1000, "a title cannot be longer than 100 characters "],
    },
    comment: {
        type: String,
        required: [true, "a review must have a comment"],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A review must have an associated user"],
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "A review must have an associated product"],
    },
}, { timestamps: true });
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.static("calculateProductRatingAndNumReviews", function (productId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield this.aggregate([
            {
                $match: {
                    product: productId,
                },
            },
            {
                $group: {
                    _id: null,
                    numOfReviews: {
                        $count: {},
                    },
                    averageRating: {
                        $avg: "$rating",
                    },
                },
            },
        ]);
        try {
            yield Product_1.Product.findByIdAndUpdate(productId, {
                numOfReviews: ((_a = stats[0]) === null || _a === void 0 ? void 0 : _a.numOfReviews) || 0,
                averageRating: ((_b = stats[0]) === null || _b === void 0 ? void 0 : _b.averageRating) || 0,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
});
reviewSchema.post("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-expect-error just testing
        yield this.constructor.calculateProductRatingAndNumReviews(this.product);
    });
});
reviewSchema.post("deleteOne", { document: true, query: false }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-expect-error just testing
        yield this.constructor.calculateProductRatingAndNumReviews(this.product);
    });
});
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
