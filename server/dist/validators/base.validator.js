import z from "zod";
export class BaseValidator {
    async idValidator(id) {
        const schema = z.string().min(23);
        schema.parse(id);
    }
    async reviewValidator(data) {
        const schema = z.object({
            rating: z.number().min(1, 'Atleast 1 start is required').max(5, 'Maximum 5 star is valid'),
            comment: z.string().trim().min(5, 'Comment atleast 5 letters is long'),
            vendor: z.string()
        });
        schema.parse(data);
    }
    async orderIdValidator(orderId) {
        const orderSchema = z.string().regex(/^ORD-\d{8}-\d{6}$/, "Invalid order ID format");
        orderSchema.parse(orderId);
    }
    async MindMapValidation(data) {
        const PlaceSchema = z.object({
            id: z.number(),
            name: z.string().min(1, "Place name is required"),
            address: z.string().min(1),
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
            description: z.string().optional(),
            selected: z.boolean(),
            timePreference: z.enum(["morning", "afternoon", "evening", "any"]),
        });
        const MindMapSchema = z.object({
            id: z.string().min(23).optional(),
            orderId: z.string().optional(),
            title: z.string().min(3, "Title must be at least 3 characters"),
            startDate: z
                .string()
                .refine((d) => !isNaN(Date.parse(d)), "Invalid start date"),
            endDate: z
                .string()
                .refine((d) => !isNaN(Date.parse(d)), "Invalid end date"),
            startPlace: z.string().min(5, "Start place is required"),
            places: z
                .array(PlaceSchema)
                .min(1, "At least one place must be selected"),
            vehicle: z.enum(["car", "bike", "traveller"]),
            milage: z
                .string()
                .regex(/^\d+$/, "Mileage must be a number string")
                .refine((v) => Number(v) > 0 && Number(v) <= 150, "Invalid mileage"),
            food: z.enum(["veg", "non-veg"]),
            foodAmount: z
                .string()
                .regex(/^\d+$/, "Food amount must be numeric")
                .refine((v) => Number(v) >= 0, "Invalid food amount"),
            room: z.enum(["5 star", "4 star", "3 star", "2&1 star"]),
            member: z
                .string()
                .regex(/^\d+$/, "Member count must be numeric")
                .refine((v) => Number(v) > 0 && Number(v) <= 10, "Invalid member count"),
        });
        MindMapSchema.parse(data);
    }
}
