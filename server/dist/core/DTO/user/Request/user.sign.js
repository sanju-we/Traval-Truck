export const userSignupDTO = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phoneNumber,
    interesets: user.interest,
    role: user.role,
    isBlocked: user.isBlocked,
});
