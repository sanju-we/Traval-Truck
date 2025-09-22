export const userSignupDTO = (user) => ({
    name: user.name,
    email: user.email,
    phone: user.phoneNumber,
    password: user.password
});
