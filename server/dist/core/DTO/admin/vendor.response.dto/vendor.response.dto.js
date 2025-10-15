export const toVendorRequestDTO = (vendor) => ({
    id: vendor._id.toString(),
    companyName: vendor.companyName,
    ownerName: vendor.ownerName,
    bankDetails: vendor.bankDetails,
    email: vendor.email,
    role: vendor.role,
    isApproved: vendor.isApproved,
    phone: vendor.phone,
});
