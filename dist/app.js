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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("express-async-errors");
const connect_1 = require("./db/connect");
const error_handler_1 = require("./middleware/error-handler");
const not_found_1 = require("./middleware/not-found");
// security packages:
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
// import xss from "xss-clean";
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cloudinary_1 = __importDefault(require("cloudinary"));
// routers
const authRoutes_1 = require("./routes/authRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const productRoutes_1 = require("./routes/productRoutes");
const reviewRoutes_1 = require("./routes/reviewRoutes");
const full_auth_1 = require("./middleware/full-auth");
const morgan_1 = __importDefault(require("morgan"));
const orderRoutes_1 = require("./routes/orderRoutes");
// allows access to env variables from .env file via process.env
(0, dotenv_1.config)();
const app = (0, express_1.default)();
//env variables
const { MONGO_URI, PORT, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, } = process.env;
// set up file upload to cloud using Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});
//security packages middlware
app.set("set proxy", 1);
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 60 }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// doesent work for some reason
// app.use(xss());
app.use((0, express_mongo_sanitize_1.default)());
// morgan logs a formatted http request line
app.use((0, morgan_1.default)("tiny"));
// lets us be able to serve our default images
app.use(express_1.default.static("public"));
// put request date into body
app.use(express_1.default.json());
// parses cookies into req.signedCookies for incoming requests
app.use((0, cookie_parser_1.default)(JWT_SECRET));
// able to access files from req.files for incoming requests
app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
app.use("/api/v1/auth", authRoutes_1.authRouter);
app.use("/api/v1/users", full_auth_1.authenticateUser, userRoutes_1.userRouter);
app.use("/api/v1/products", productRoutes_1.productRouter);
app.use("/api/v1/reviews", reviewRoutes_1.reviewRouter);
app.use("/api/v1/orders", full_auth_1.authenticateUser, orderRoutes_1.orderRouter);
app.use(not_found_1.notFound);
// error handler must be last middlware by express rules
app.use(error_handler_1.errorHandlerMiddleware);
const port = PORT || 5000;
// start up server and MongoDB connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.connectDB)(MONGO_URI);
        console.log(`db is up and running...`);
        app.listen(port, () => console.log(`Server is up and running on port ${port}...`));
    }
    catch (error) {
        console.log(error);
    }
}))();
