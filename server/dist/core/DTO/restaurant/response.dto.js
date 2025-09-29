export const toRestaunrantProfile = (restaunrat) => ({
    id: restaunrat._id.toString(),
    companyName: restaunrat.companyName,
    ownerName: restaunrat.ownerName,
    email: restaunrat.email,
    password: restaunrat.password,
    phone: restaunrat.phone,
    role: restaunrat.role,
    approved: restaunrat.isApproved,
    rating: restaunrat.rating,
    totalReviews: restaunrat.totalReviews,
});
