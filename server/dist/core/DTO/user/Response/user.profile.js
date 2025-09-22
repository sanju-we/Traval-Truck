export const toUserProfileDTO = (user) => ({
    id: user._id.toString(),
    name: user.name,
    userName: user.userName,
    email: user.email,
    password: user.password,
    bio: user.bio,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
    role: user.role,
    isBlocked: user.isBlocked,
    googleId: user.googleId,
    interest: user.interest
});
