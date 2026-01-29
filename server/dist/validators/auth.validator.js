"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidator = void 0;
const zod_1 = __importDefault(require("zod"));
class authValidator {
    async signUpValidator(enteredEmail, enteredOtp, agencyData) {
        const schema = zod_1.default.object({
            enteredEmail: zod_1.default.email("Please enter a valid email address.").trim().toLowerCase().max(100, "Email is too long."),
            enteredOtp: zod_1.default.string().length(6).regex(/^\d{6}$/, "OTP must be a 6-digit number."),
            agencyData: zod_1.default.object({
                ownerName: zod_1.default.string('Owner name must in characters no other special characters are allowed').min(3, "Owner name must be at least 3 characters.").max(50, "Owner name cannot exceed 50 characters.").regex(/^[A-Za-z\s]+$/, "Owner name must contain only letters and spaces."),
                companyName: zod_1.default.string('Company name must be in characters, special charcters is not allowed').trim().min(2, "Company name must be at least 2 characters.").max(100, "Company name cannot exceed 100 characters.").regex(/^[A-Za-z\s&.,'-]+$/, "Company name can contain letters, spaces, and limited punctuation (&, ., ', -)."),
                email: zod_1.default.email("Please enter a valid email address.").trim().toLowerCase().max(100, "Email is too long."),
                password: zod_1.default.string().min(8, "Password must be at least 8 characters long.").max(64, "Password cannot exceed 64 characters.").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/, "Password must be at least 8 characters, include letters, numbers, and only '_' is allowed as special character"),
                phone: zod_1.default.number('Phone number must be numbers only'),
            }),
        });
        schema.parse({ enteredEmail, enteredOtp, agencyData });
    }
    async loginValidator(email, password) {
        const schema = zod_1.default.object({
            email: zod_1.default.email("Please enter a valid email address.").trim().toLowerCase().max(100, "Email is too long."),
            password: zod_1.default.string().min(8, "Password must be at least 8 characters long.").max(64, "Password cannot exceed 64 characters.").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/, "Password must be at least 8 characters, include letters, numbers, and only '_' is allowed as special character"),
        });
        schema.parse({ email, password });
    }
    async emailValidator(email) {
        const schema = zod_1.default.email("Please enter a valid email address.").trim().toLowerCase().max(100, "Email is too long.");
        schema.parse(email);
    }
    async addPackageValidator(data) {
        const itinerarySchema = zod_1.default.object({
            day: zod_1.default.number().int().positive("Day must be a positive integer"),
            title: zod_1.default.string().min(1, "Title is required"),
            activities: zod_1.default
                .array(zod_1.default.string().min(1, "Activity cannot be empty"))
                .min(1, "At least one activity required"),
        });
        const partnerPackageSchema = zod_1.default.object({
            title: zod_1.default.string().min(1, "Title is required"),
            description: zod_1.default.string().min(1, "Description is required"),
            duration: zod_1.default.string().min(1, "Duration is required"),
            price: zod_1.default
                .string()
                .regex(/^\d+$/, "Price must be a number string")
                .transform((val) => parseInt(val, 10)),
            availableFoods: zod_1.default
                .array(zod_1.default.string().min(1))
                .nonempty("At least one food item required"),
            discoveries: zod_1.default
                .array(zod_1.default.string().min(1))
                .nonempty("At least one discovery required"),
            itinerary: zod_1.default
                .array(itinerarySchema)
                .min(1, "At least one itinerary day required"),
        });
        partnerPackageSchema.parse(data);
    }
    async resetPasswordValidator(token, newPassword) {
        const schema = zod_1.default.object({
            token: zod_1.default.string().trim().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, "Invalid or malformed JWT token.").max(2048, "JWT token is too long."),
            newPassword: zod_1.default.string().trim().min(8, "Password must be at least 8 characters long.").max(64, "Password cannot exceed 64 characters.").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/, "Password must be at least 8 characters, include letters, numbers, and only '_' is allowed as special character"),
        });
        schema.parse({ token, newPassword });
    }
    async profileUpdateValidator(ownerName, companyName, phone, bankDetails) {
        const schema = zod_1.default.object({
            ownerName: zod_1.default.string().trim().min(3, "Owner name must be at least 3 characters long.").max(50, "Owner name cannot exceed 50 characters.").regex(/^[A-Za-z\s]+$/, "Owner name must contain only letters and spaces."),
            companyName: zod_1.default.string().trim().min(3, "Company name must be at least 3 characters long.").max(100, "Company name cannot exceed 100 characters.").regex(/^[A-Za-z0-9\s&.,'-]+$/, "Company name can only contain letters, numbers, and common symbols (& , . ' -)."),
            phone: zod_1.default.number().min(10, 'Phone number must be 10 number'),
            bankDetails: zod_1.default.object({
                accountHolder: zod_1.default.string().trim().min(3, "Account holder name must be at least 3 characters.").max(50, "Account holder name cannot exceed 50 characters.").regex(/^[A-Za-z\s]+$/, "Account holder name must contain only letters and spaces."),
                accountNumber: zod_1.default.string().trim().regex(/^\d{9,18}$/, "Account number must be between 9 and 18 digits."),
                bankName: zod_1.default.string().trim().min(3, "Bank name must be at least 3 characters long.").max(100, "Bank name cannot exceed 100 characters.").regex(/^[A-Za-z\s]+$/, "Bank name must contain only alphabets and spaces."),
                ifscCode: zod_1.default.string().trim().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format (e.g., HDFC0001234)."),
            }),
        });
        schema.parse({ ownerName, companyName, phone, bankDetails });
    }
    async RoomValidator(data) {
        const roomSchema = zod_1.default.object({
            Facilities: zod_1.default
                .string(),
            Capacity: zod_1.default
                .union([zod_1.default.string(), zod_1.default.number()])
                .transform((val) => Number(val))
                .refine((val) => !isNaN(val) && val > 0, {
                message: "Capacity must be a valid positive number",
            }),
            Description: zod_1.default
                .string()
                .min(3, { message: "Description must be at least 3 characters long" }),
            PricePerNight: zod_1.default
                .union([zod_1.default.string(), zod_1.default.number()])
                .transform((val) => Number(val))
                .refine((val) => !isNaN(val) && val >= 0, {
                message: "Price must be a valid non-negative number",
            }),
            RoomNumber: zod_1.default
                .union([zod_1.default.string(), zod_1.default.number()])
                .transform((val) => Number(val))
                .refine((val) => !isNaN(val), {
                message: "Room number must be a valid number",
            }),
            roomType: zod_1.default
                .string()
                .min(2, { message: "Room type must be at least 2 characters long" }),
        });
        roomSchema.parse(data);
    }
    async updateStatusValidator(id, status) {
        const schema = zod_1.default.object({
            id: zod_1.default.string().min(10),
            status: zod_1.default.enum(['Available', 'Maintance'])
        });
        schema.parse({ id, status });
    }
}
exports.authValidator = authValidator;
