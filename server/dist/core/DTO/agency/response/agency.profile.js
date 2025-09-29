export const toAgencyProfileDTO = (agency) => ({
    id: agency._id.toString(),
    companyName: agency.companyName,
    ownerName: agency.ownerName,
    email: agency.email,
    password: agency.password,
    phone: agency.phone,
    role: agency.role,
    approved: agency.isApproved,
    rating: agency.rating,
    totalReviews: agency.totalReviews,
});
