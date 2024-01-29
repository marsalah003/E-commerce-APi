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
exports.User = void 0;
const bcryptjs_1 = require("bcryptjs");
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "name must be provided"],
        minlength: [5, "name must be longer than 5 characters"],
        maxlength: [50, "name must be shorter than 50 characters"],
    },
    email: {
        type: String,
        required: [true, "email must be provided"],
        validate: {
            validator: (email) => (0, validator_1.isEmail)(email),
            message: `please provide a valid email address`,
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password must be provided"],
        minlength: [5, "password must be longer than 5 characters"],
        maxlength: [70, "password must be shorter than 70 characters"],
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
});
userSchema.methods.comparePassword = function (candidatePassword) {
    return (0, bcryptjs_1.compare)(candidatePassword, this.password);
};
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return;
        const salt = yield (0, bcryptjs_1.genSalt)(10);
        this.password = yield (0, bcryptjs_1.hash)(this.password, salt);
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
