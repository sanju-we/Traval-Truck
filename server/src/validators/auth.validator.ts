import { IAuthValidator } from "../core/interface/validator/Iauth.validator.js";
import z from "zod";
import { PackageDTO } from "../core/DTO/agency/request/packageDTO.js";
import { vendorData } from "../types/index.js";
import { RoomsDTO } from "@core/DTO/hotel/roomsDTO.js";

export class authValidator implements IAuthValidator {

  async signUpValidator(enteredEmail: string, enteredOtp: string, agencyData: vendorData): Promise<void> {
    const schema = z.object({
      enteredEmail: z.email("Please enter a valid email address.").trim().toLowerCase().max(100, "Email is too long."),
      enteredOtp: z.string().length(6).regex(/^\d{6}$/, "OTP must be a 6-digit number."),
      agencyData: z.object({
        ownerName: z.string('Owner name must in characters no other special characters are allowed').min(3, "Owner name must be at least 3 characters.").max(50, "Owner name cannot exceed 50 characters.").regex(/^[A-Za-z\s]+$/, "Owner name must contain only letters and spaces."),
        companyName: z.string('Company name must be in characters, special charcters is not allowed').trim().min(2, "Company name must be at least 2 characters.").max(100, "Company name cannot exceed 100 characters.").regex(/^[A-Za-z\s&.,'-]+$/, "Company name can contain letters, spaces, and limited punctuation (&, ., ', -)."),
        email: z.email("Please enter a valid email address.").trim().toLowerCase().max(100, "Email is too long."),
        password: z.string().min(8, "Password must be at least 8 characters long.").max(64, "Password cannot exceed 64 characters.").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/, "Password must be at least 8 characters, include letters, numbers, and only '_' is allowed as special character"),
        phone: z.number('Phone number must be numbers only'),
      }),
    });
    schema.parse({ enteredEmail, enteredOtp, agencyData })
  }

  async loginValidator(email: string, password: string): Promise<void> {
    const schema = z.object({
      email: z.email("Please enter a valid email address.").trim().toLowerCase().max(100, "Email is too long."),
      password: z.string().min(8, "Password must be at least 8 characters long.").max(64, "Password cannot exceed 64 characters.").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/, "Password must be at least 8 characters, include letters, numbers, and only '_' is allowed as special character"),
    });
    schema.parse({ email, password })
  }

  async emailValidator(email: string): Promise<void> {
    const schema = z.email("Please enter a valid email address.").trim().toLowerCase().max(100, "Email is too long.")
    schema.parse(email)
  }

  

  async addPackageValidator(data: PackageDTO): Promise<void> {
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

      discoveries: z
        .array(z.string().min(1))
        .nonempty("At least one discovery required"),

      itinerary: z
        .array(itinerarySchema)
        .min(1, "At least one itinerary day required"),
    });
    partnerPackageSchema.parse(data)
  }

  async resetPasswordValidator(token: string, newPassword: string): Promise<void> {
    const schema = z.object({
      token: z.string().trim().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, "Invalid or malformed JWT token.").max(2048, "JWT token is too long."),
      newPassword: z.string().trim().min(8, "Password must be at least 8 characters long.").max(64, "Password cannot exceed 64 characters.").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/, "Password must be at least 8 characters, include letters, numbers, and only '_' is allowed as special character"),
    });
    schema.parse({ token, newPassword })
  }

  async profileUpdateValidator(ownerName: string, companyName: string, phone: number, bankDetails: { accountHolder: string; accountNumber: string; bankName: string; ifscCode: string; }): Promise<void> {
    const schema = z.object({
      ownerName: z.string().trim().min(3, "Owner name must be at least 3 characters long.").max(50, "Owner name cannot exceed 50 characters.").regex(/^[A-Za-z\s]+$/, "Owner name must contain only letters and spaces."),
      companyName: z.string().trim().min(3, "Company name must be at least 3 characters long.").max(100, "Company name cannot exceed 100 characters.").regex(/^[A-Za-z0-9\s&.,'-]+$/, "Company name can only contain letters, numbers, and common symbols (& , . ' -)."),
      phone: z.number().min(10, 'Phone number must be 10 number'),
      bankDetails: z.object({
        accountHolder: z.string().trim().min(3, "Account holder name must be at least 3 characters.").max(50, "Account holder name cannot exceed 50 characters.").regex(/^[A-Za-z\s]+$/, "Account holder name must contain only letters and spaces."),
        accountNumber: z.string().trim().regex(/^\d{9,18}$/, "Account number must be between 9 and 18 digits."),
        bankName: z.string().trim().min(3, "Bank name must be at least 3 characters long.").max(100, "Bank name cannot exceed 100 characters.").regex(/^[A-Za-z\s]+$/, "Bank name must contain only alphabets and spaces."),
        ifscCode: z.string().trim().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format (e.g., HDFC0001234)."),
      }),
    });
    schema.parse({ ownerName, companyName, phone, bankDetails })
  }

  async RoomValidator(data: RoomsDTO): Promise<void> {
    const roomSchema = z.object({
      Facilities: z
        .string(),
      Capacity: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, {
          message: "Capacity must be a valid positive number",
        }),

      Description: z
        .string()
        .min(3, { message: "Description must be at least 3 characters long" }),

      PricePerNight: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
          message: "Price must be a valid non-negative number",
        }),

      RoomNumber: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), {
          message: "Room number must be a valid number",
        }),

      roomType: z
        .string()
        .min(2, { message: "Room type must be at least 2 characters long" }),
    });
    roomSchema.parse(data)
  }

  async updateStatusValidator(id: string, status: string): Promise<void> {
    const schema = z.object({
      id: z.string().min(10),
      status: z.enum(['Available', 'Maintance'])
    })
    schema.parse({ id, status })
  }
}