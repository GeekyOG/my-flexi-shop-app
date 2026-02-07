import { z } from "zod";

import { nameRegex } from "@/lib/utils";

// Define the schema
export const singleUserSchema = z.object({
    personalDetails: z.array(
        z.object({
            firstName: z
                .string()
                .min(1, "First name is required")
                .max(100, "First name must not exceed 100 characters")
                .regex(nameRegex, "Name must contain only letters"),
            lastName: z
                .string()
                .min(1, "Last name is required")
                .max(100, "Last name must not exceed 100 characters")
                .regex(nameRegex, "Name must contain only letters"),
            title: z.string().min(1, "Title is required"),

            phoneNumber: z
                .string()
                .min(10, "Phone number must be at least 10 digits"),

            email: z.string().email("Invalid email address"),

            isMainPolicyHolder: z.boolean(),
            clientId: z.string().min(1, ""),
            clientType: z.string().optional(),
        })
    ),
});

// Define TypeScript type from schema
export type PersonalDetailsData = z.infer<typeof singleUserSchema>;
