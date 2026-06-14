"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseValidator = void 0;
const zod_1 = __importDefault(require("zod"));
class BaseValidator {
    async idValidator(id) {
        const schema = zod_1.default.string().min(23);
        schema.parse(id);
    }
    async InterestValidator(interest, id) {
        const schema = zod_1.default.object({
            interests: zod_1.default.array(zod_1.default.string()),
            id: zod_1.default.string().optional(),
        });
        schema.parse({ interest, id });
    }
    async reviewValidator(data) {
        const schema = zod_1.default.object({
            rating: zod_1.default.number().min(1, 'Atleast 1 start is required').max(5, 'Maximum 5 star is valid'),
            comment: zod_1.default.string().trim().min(5, 'Comment atleast 5 letters is long'),
            vendor: zod_1.default.string()
        });
        schema.parse(data);
    }
    async orderIdValidator(orderId) {
        const orderSchema = zod_1.default.string().regex(/^ORD-\d{8}-\d{6}$/, "Invalid order ID format");
        orderSchema.parse(orderId);
    }
    async MindMapValidation(data) {
        const PlaceSchema = zod_1.default.object({
            id: zod_1.default.number(),
            name: zod_1.default.string().min(1, "Place name is required"),
            address: zod_1.default.string().min(1),
            lat: zod_1.default.number().min(-90).max(90),
            lng: zod_1.default.number().min(-180).max(180),
            description: zod_1.default.string().optional(),
            selected: zod_1.default.boolean(),
            timePreference: zod_1.default.enum(["morning", "afternoon", "evening", "any"]),
        });
        const MindMapSchema = zod_1.default.object({
            id: zod_1.default.string().min(23).optional(),
            orderId: zod_1.default.string().optional(),
            title: zod_1.default.string().min(3, "Title must be at least 3 characters"),
            startDate: zod_1.default
                .string()
                .refine((d) => !isNaN(Date.parse(d)), "Invalid start date"),
            endDate: zod_1.default
                .string()
                .refine((d) => !isNaN(Date.parse(d)), "Invalid end date"),
            startPlace: zod_1.default.string().min(5, "Start place is required"),
            places: zod_1.default
                .array(PlaceSchema)
                .min(1, "At least one place must be selected"),
            vehicle: zod_1.default.enum(["car", "bike", "traveller"]),
            milage: zod_1.default
                .string()
                .regex(/^\d+$/, "Mileage must be a number string")
                .refine((v) => Number(v) > 0 && Number(v) <= 150, "Invalid mileage"),
            food: zod_1.default.enum(["veg", "non-veg"]),
            foodAmount: zod_1.default
                .string()
                .regex(/^\d+$/, "Food amount must be numeric")
                .refine((v) => Number(v) >= 0, "Invalid food amount"),
            room: zod_1.default.enum(["5 star", "4 star", "3 star", "2&1 star"]),
            member: zod_1.default
                .string()
                .regex(/^\d+$/, "Member count must be numeric")
                .refine((v) => Number(v) > 0 && Number(v) <= 10, "Invalid member count"),
        });
        MindMapSchema.parse(data);
    }
}
exports.BaseValidator = BaseValidator;
