"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomValidator = void 0;
const zod_1 = __importDefault(require("zod"));
class RoomValidator {
    async roomValidator(data) {
        const roomSchema = zod_1.default.object({
            Capacity: zod_1.default.string().regex(/^\d+$/, "Capacity must be a numeric string"),
            Description: zod_1.default.string().min(1, "Description is required").min(1, "At least one facility is required"),
            Facilities: zod_1.default.array(zod_1.default.string().min(1, "Facility name cannot be empty")),
            PricePerNight: zod_1.default.string().regex(/^\d+$/, "PricePerNight must be a numeric string"),
            RoomNumber: zod_1.default.string().regex(/^\d+$/, "RoomNumber must be a numeric string"),
            Status: zod_1.default.enum(["Available", "Occupid", "Maintance"]),
            isBlocked: zod_1.default.enum(["true", "false"])
        });
        roomSchema.parse(data);
    }
}
exports.RoomValidator = RoomValidator;
