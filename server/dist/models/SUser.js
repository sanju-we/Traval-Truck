"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// inferASchemaType and hyderatedDocument
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
    },
    userName: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    interest: [
        {
            type: String,
        },
    ],
    password: {
        type: String,
        unique: false,
    },
    googleId: {
        type: String,
        unique: false,
    },
    gender: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    profilePicture: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: new Date(),
    },
    role: {
        type: String,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        required: true,
    },
});
exports.User = (0, mongoose_1.model)('User', userSchema);
