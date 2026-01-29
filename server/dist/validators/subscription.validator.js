"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionValidator = void 0;
const zod_1 = __importDefault(require("zod"));
class SubscriptionValidator {
    async addSubscriptionValidator(Name, Amount, Category, Description, Duration, Features, Valid) {
        const schema = zod_1.default.object({
            Name: zod_1.default.string().trim().min(3, "Name must be at least 3 characters long.").max(100, "Name cannot exceed 100 characters.").regex(/^[A-Za-z0-9\s&.,'()-]+$/, "Name contains invalid characters."),
            Amount: zod_1.default.number("Amount is required.").positive("Amount must be greater than 0.").max(10000000, "Amount cannot exceed 10 million."),
            Category: zod_1.default.string().trim().min(3, "Category must be at least 3 characters long.").max(50, "Category cannot exceed 50 characters.").regex(/^[A-Za-z\s&]+$/, "Category must contain only letters and spaces."),
            Description: zod_1.default.string().trim().min(10, "Description must be at least 10 characters long.").max(1000, "Description cannot exceed 1000 characters."),
            Duration: zod_1.default.object({
                startingDate: zod_1.default.string().trim().refine((val) => !isNaN(Date.parse(val)), "Starting date must be a valid date string."),
                endingDate: zod_1.default.string().trim().refine((val) => !isNaN(Date.parse(val)), "Ending date must be a valid date string."),
            }),
            Features: zod_1.default.array(zod_1.default.string().trim().min(3, "Each feature must be at least 3 characters long.").max(100, "Feature description too long.")).nonempty("At least one feature is required.").max(20, "You can list up to 20 features only."),
            Valid: zod_1.default.number().positive("Valid duration must be greater than 0.").max(3650, "Valid duration cannot exceed 10 years."),
        });
        schema.parse({ Name, Amount, Category, Description, Duration, Features, Valid });
    }
    async updateStatusValidator(id, action, role) {
        const schema = zod_1.default.object({
            id: zod_1.default.string(),
            action: zod_1.default.enum(['approve', 'reject']),
            role: zod_1.default.enum(['agency', 'hotel', 'restaurant']),
        });
        schema.parse({ id, action, role });
    }
    async reasonValidation(reason) {
        const bodySchema = zod_1.default.object({
            reason: zod_1.default.string().nullable(),
        });
        bodySchema.parse(reason);
    }
    async updateBlockValidator(id, role) {
        const schema = zod_1.default.object({
            id: zod_1.default.string(),
            role: zod_1.default.string(),
        });
        schema.parse({ id, role });
    }
}
exports.SubscriptionValidator = SubscriptionValidator;
