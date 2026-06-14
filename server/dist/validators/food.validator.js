"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodValidator = void 0;
const zod_1 = __importDefault(require("zod"));
class FoodValidator {
    async FoodValidator(name, description, price, availableQ, category, status) {
        const foodTypeSchema = zod_1.default.object({
            name: zod_1.default.string().min(1, "Name is required"),
            description: zod_1.default.string().min(1, "Description is required"),
            price: zod_1.default.number().positive("Price must be greater than 0"),
            availableQ: zod_1.default.number().int().nonnegative("Quantity must be 0 or more"),
            status: zod_1.default.enum(['Available', 'Finish']),
            category: zod_1.default.string().min(1, "Category is required"),
        });
        foodTypeSchema.parse({ name, description, price, availableQ, category, status });
    }
}
exports.FoodValidator = FoodValidator;
