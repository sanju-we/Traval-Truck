"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toVendorAuth = void 0;
const toVendorAuth = (vendor) => ({
    id: vendor._id.toString(),
    companyName: vendor.companyName,
    email: vendor.email,
    ownerName: vendor.ownerName,
    role: vendor.role,
    isBlocked: vendor.isApproved,
    isRestricted: vendor.isRestricted,
});
exports.toVendorAuth = toVendorAuth;
