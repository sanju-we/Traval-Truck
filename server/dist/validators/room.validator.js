import z from "zod";
export class RoomValidator {
    async roomValidator(data) {
        const roomSchema = z.object({
            Capacity: z.string().regex(/^\d+$/, "Capacity must be a numeric string"),
            Description: z.string().min(1, "Description is required").min(1, "At least one facility is required"),
            Facilities: z.array(z.string().min(1, "Facility name cannot be empty")),
            PricePerNight: z.string().regex(/^\d+$/, "PricePerNight must be a numeric string"),
            RoomNumber: z.string().regex(/^\d+$/, "RoomNumber must be a numeric string"),
            Status: z.enum(["Available", "Occupid", "Maintance"]),
            isBlocked: z.enum(["true", "false"])
        });
        roomSchema.parse(data);
    }
}
