export const toVendorAuth = (vendor) => ({
    id: vendor._id.toString(),
    companyName: vendor.companyName,
    email: vendor.email,
    ownerName: vendor.ownerName,
    role: vendor.role,
    isBlocked: vendor.isApproved,
    isRestricted: vendor.isRestricted,
});
