export const toHotelProfile = (hotel) => ({
    id: hotel._id.toString(),
    companyName: hotel.companyName,
    ownerName: hotel.ownerName,
    email: hotel.email,
    password: hotel.password,
    phone: hotel.phone,
    role: hotel.role,
    approved: hotel.isApproved,
    rating: hotel.rating,
    totalReviews: hotel.totalReviews,
});
