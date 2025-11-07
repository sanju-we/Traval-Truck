import z from "zod";
export class agencyValidator {
    async agencyAddPartner(data) {
        const schema = z.object({
            ContactPerson: z.string(),
            Coordinates: z.object({
                lat: z.number(),
                lng: z.number(),
            }),
            Details: z.array(z.object({
                AvgPriceRange: z.number().nonnegative(),
                Category: z.string(),
                Description: z.string(),
                Facilities: z.array(z.string()),
            })),
            Email: z.email(),
            Location: z.string(),
            PartnerName: z.string(),
            PartnerType: z.enum(['Hotel', 'Restaurant']),
            Phone: z.string(),
            Status: z.string(),
        });
        return schema.parse(data);
    }
    async addPackageValidator(data) {
        const itinerarySchema = z.object({
            day: z.number().int().positive("Day must be a positive integer"),
            title: z.string().min(1, "Title is required"),
            activities: z
                .array(z.string().min(1, "Activity cannot be empty"))
                .min(1, "At least one activity required"),
        });
        const partnerPackageSchema = z.object({
            title: z.string().min(1, "Title is required"),
            description: z.string().min(1, "Description is required"),
            duration: z.string().min(1, "Duration is required"),
            price: z
                .string()
                .regex(/^\d+$/, "Price must be a number string")
                .transform((val) => parseInt(val, 10)),
            availableFoods: z
                .array(z.string().min(1))
                .nonempty("At least one food item required"),
            dining: z
                .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"))
                .nonempty("At least one dining ID required"),
            hotels: z
                .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"))
                .nonempty("At least one hotel ID required"),
            discoveries: z
                .array(z.string().min(1))
                .nonempty("At least one discovery required"),
            itinerary: z
                .array(itinerarySchema)
                .min(1, "At least one itinerary day required"),
        });
        return partnerPackageSchema.parse(data);
    }
}
