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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getAllProducts = exports.createProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const Product_1 = require("../models/Product");
const errors_1 = require("../errors");
const cloudinary_1 = __importDefault(require("cloudinary"));
const promises_1 = require("fs/promises");
const createProduct = ({ body, user: { userId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.Product.create(Object.assign(Object.assign({}, body), { user: userId }));
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ product });
});
exports.createProduct = createProduct;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: products.length, products });
});
exports.getAllProducts = getAllProducts;
const getSingleProduct = ({ params: { id: productId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.Product.findOne({ _id: productId });
    if (!product)
        throw new errors_1.BadRequestError(`There is no product with id ${productId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.getSingleProduct = getSingleProduct;
const updateProduct = ({ body, params: { id: productId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProduct = yield Product_1.Product.findOneAndUpdate({ _id: productId }, body, { new: true, runValidators: true });
    if (!updatedProduct)
        throw new errors_1.BadRequestError(`No product with id ${productId}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ updatedProduct });
});
exports.updateProduct = updateProduct;
const deleteProduct = ({ params: { id: productId } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productToDelete = yield Product_1.Product.findById(productId);
    if (!productToDelete)
        throw new errors_1.BadRequestError(`No product with id ${productId}`);
    yield productToDelete.deleteOne();
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: "product deleted" });
});
exports.deleteProduct = deleteProduct;
const uploadImage = ({ files }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!files)
        throw new errors_1.BadRequestError("An image must be provided");
    if (!files.image.mimetype.startsWith("image"))
        throw new errors_1.BadRequestError("please upload an image");
    const maxSize = 1024 * 1024;
    if (files.image.size > maxSize)
        throw new errors_1.BadRequestError("image too large");
    const { secure_url } = yield cloudinary_1.default.v2.uploader.upload(files.image.tempFilePath, {
        use_filename: true,
        folder: "10-E-commerce-API",
        auto: true,
    });
    yield (0, promises_1.unlink)(files.image.tempFilePath);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ image: { src: secure_url } });
});
exports.uploadImage = uploadImage;
