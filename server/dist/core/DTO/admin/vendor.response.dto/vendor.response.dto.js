"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toVendorRequestDTO = void 0;
const toVendorRequestDTO = (vendor) => ({
    id: vendor._id.toString(),
    companyName: vendor.companyName,
    ownerName: vendor.ownerName,
    bankDetails: vendor.bankDetails,
    documents: vendor.documents,
    logo: vendor.logo,
    email: vendor.email,
    role: vendor.role,
    isApproved: vendor.isApproved,
    address: vendor.address,
    phone: vendor.phone,
    isRestricted: vendor.isRestricted,
    reason: vendor.reason,
});
exports.toVendorRequestDTO = toVendorRequestDTO;
