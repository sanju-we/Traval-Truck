import z from "zod";
export class SubscriptionValidator {
    async addSubscriptionValidator(Name, Amount, Category, Description, Duration, Features, Valid) {
        const schema = z.object({
            Name: z.string().trim().min(3, "Name must be at least 3 characters long.").max(100, "Name cannot exceed 100 characters.").regex(/^[A-Za-z0-9\s&.,'()\-]+$/, "Name contains invalid characters."),
            Amount: z.number("Amount is required.").positive("Amount must be greater than 0.").max(10000000, "Amount cannot exceed 10 million."),
            Category: z.string().trim().min(3, "Category must be at least 3 characters long.").max(50, "Category cannot exceed 50 characters.").regex(/^[A-Za-z\s&]+$/, "Category must contain only letters and spaces."),
            Description: z.string().trim().min(10, "Description must be at least 10 characters long.").max(1000, "Description cannot exceed 1000 characters."),
            Duration: z.object({
                startingDate: z.string().trim().refine((val) => !isNaN(Date.parse(val)), "Starting date must be a valid date string."),
                endingDate: z.string().trim().refine((val) => !isNaN(Date.parse(val)), "Ending date must be a valid date string."),
            }),
            Features: z.array(z.string().trim().min(3, "Each feature must be at least 3 characters long.").max(100, "Feature description too long.")).nonempty("At least one feature is required.").max(20, "You can list up to 20 features only."),
            Valid: z.number().positive("Valid duration must be greater than 0.").max(3650, "Valid duration cannot exceed 10 years."),
        });
        schema.parse({ Name, Amount, Category, Description, Duration, Features, Valid });
    }
    async updateStatusValidator(id, action, role) {
        const schema = z.object({
            id: z.string(),
            action: z.enum(['approve', 'reject']),
            role: z.enum(['agency', 'hotel', 'restaurant']),
        });
        schema.parse({ id, action, role });
    }
    async reasonValidation(reason) {
        const bodySchema = z.object({
            reason: z.string().nullable(),
        });
        bodySchema.parse(reason);
    }
    async updateBlockValidator(id, role) {
        const schema = z.object({
            id: z.string(),
            role: z.string(),
        });
        schema.parse({ id, role });
    }
}
