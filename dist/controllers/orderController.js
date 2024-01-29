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
exports.updateOrder = exports.createOrder = exports.getCurrentUserOrders = exports.getSingleOrder = exports.getAllOrders = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const Product_1 = require("../models/Product");
const stripe_1 = require("stripe");
const Order_1 = require("../models/Order");
const utils_1 = require("../utils");
const createOrder = ({ body: { tax, shippingFee, items: cartItems }, user: { userId: user }, }, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if there are items in cart
    if (!cartItems || !cartItems.length)
        throw new errors_1.BadRequestError("no cart items provided");
    if (!tax || !shippingFee)
        throw new errors_1.BadRequestError("tax and shipping fee must be provided");
    const orderItems = [];
    let subTotal = 0;
    for (const { product: productId, amount } of cartItems) {
        const product = yield Product_1.Product.findById(productId);
        if (!product)
            throw new errors_1.NotFoundError(`product with id: ${productId} does not exist`);
        const { name, price, image } = product;
        orderItems.push({ price, amount, name, image, product: productId });
        subTotal += price * amount;
    }
    const total = subTotal + tax + shippingFee;
    const { STRIPE_SECRET_KEY } = process.env;
    const stripe = new stripe_1.Stripe(STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
    });
    const { id: paymentIntentId, client_secret: clientSecret } = yield stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
    });
    const order = yield Order_1.Order.create({
        tax,
        shippingFee,
        total,
        subTotal,
        orderItems,
        user,
        clientSecret,
        paymentIntentId,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ order, clientSecret });
});
exports.createOrder = createOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.Order.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: orders.length, orders });
});
exports.getAllOrders = getAllOrders;
const getSingleOrder = ({ params: { id: orderId }, user }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.Order.findById(orderId);
    if (!order)
        throw new errors_1.BadRequestError(`order with id ${orderId} does not exist`);
    (0, utils_1.checkPermissions)(user, order.user.toString());
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.getSingleOrder = getSingleOrder;
const getCurrentUserOrders = ({ user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.Order.find({ user: userId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: orders.length, orders });
});
exports.getCurrentUserOrders = getCurrentUserOrders;
const updateOrder = ({ body: { paymentIntentId }, params: { id: orderId }, user }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.Order.findById(orderId);
    if (!order)
        throw new errors_1.BadRequestError(`order with id ${orderId} does not exist`);
    (0, utils_1.checkPermissions)(user, order.user.toString());
    order.paymentIntentId = paymentIntentId;
    order.status = "paid";
    yield order.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.updateOrder = updateOrder;
