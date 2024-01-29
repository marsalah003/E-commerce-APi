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
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "a product must have a Name"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"],
    },
    price: {
        type: Number,
        default: 0,
        required: [true, "a product must have a price"],
    },
    description: {
        type: String,
        required: [true, "a product must have a description"],
        maxlength: [1000, "description cannot be more than 1000 characters"],
    },
    image: { type: String, default: "/uploads/default_image.png" },
    category: {
        type: String,
        enum: ["office", "kitchen", "bedroom"],
        required: [true, "a product must have a category"],
    },
    company: {
        type: String,
        required: [true, "a product must have a company"],
        enum: {
            values: ["ikea", "liddy", "marcos"],
            message: `the products company chosen: {VALUE} is not from one of those predefined`,
        },
    },
    colors: {
        type: [String],
        default: ["#222"],
        required: [true, "a product must have colour(s)"],
    },
    featured: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    inventory: { type: Number, default: 15 },
    averageRating: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A product must have an associated user"],
    },
}, {
    timestamps: true /*toJSON: { virtuals: true }, toObject: { virtuals: true }*/,
});
// virtual example
// productSchema.virtual("reviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "product",
//   justOne: false,
// });
productSchema.pre("deleteOne", { document: true, query: false }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        // await Review.deleteMany({ product: this._id });
        yield this.model("Review").deleteMany({ product: this._id });
    });
});
exports.Product = (0, mongoose_1.model)("Product", productSchema);
