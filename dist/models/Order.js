"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.singleOrderItemSchema = void 0;
const mongoose_1 = require("mongoose");
exports.singleOrderItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
});
const orderSchema = new mongoose_1.Schema({
    tax: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    orderItems: [exports.singleOrderItemSchema],
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "failed", "paid", "delivered", "cancelled"],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "an order must have an associating user"],
    },
    clientSecret: {
        type: String,
        required: [true, "an order must contain a client secret"],
    },
    paymentIntentId: {
        type: String,
        required: [true, "an order must have a payment id"],
    },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
