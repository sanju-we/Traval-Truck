"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignupDTO = void 0;
const userSignupDTO = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phoneNumber,
    interesets: user.interest,
    role: user.role,
    isBlocked: user.isBlocked,
});
exports.userSignupDTO = userSignupDTO;
