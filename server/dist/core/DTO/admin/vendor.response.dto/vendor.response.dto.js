export const toVendorRequestDTO = (vendor) => ({
    id: vendor._id.toString(),
    companyName: vendor.companyName,
    ownerName: vendor.ownerName,
    email: vendor.email,
    role: vendor.role,
    isApproved: vendor.isApproved,
    phone: vendor.phone,
});
