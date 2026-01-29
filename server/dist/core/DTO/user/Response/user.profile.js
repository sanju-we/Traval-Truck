"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserProfileDTO = void 0;
const toUserProfileDTO = (user) => ({
    id: user._id.toString(),
    name: user.name,
    userName: user.userName || 'Unknown',
    email: user.email,
    bio: user.bio,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
    role: user.role,
    isBlocked: user.isBlocked,
    interest: user.interest,
});
exports.toUserProfileDTO = toUserProfileDTO;
