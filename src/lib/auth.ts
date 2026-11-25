import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";

const mongoUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!mongoUri) throw new Error("MONGODB_URI is required by Better Auth.");
if (!authSecret || authSecret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be set and contain at least 32 characters.");
}

const mongoClient = new MongoClient(mongoUri);
const database = mongoClient.db(process.env.MONGODB_DB_NAME || "wedplan");
const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

export const auth = betterAuth({
  appName: "WedPlan",
  baseURL: appUrl,
  secret: authSecret,
  database: mongodbAdapter(database),
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || appUrl],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: googleProvider,
  user: {
    modelName: "users",
    additionalFields: {
      // Admin is intentionally excluded from public signup values.
      role: {
        // Keep this a string so the privately assigned "admin" role can be read by Better Auth.
        // databaseHooks below restrict public account creation and prevent self-service role changes.
        type: "string",
        required: true,
        defaultValue: "customer",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      subscriptionPlan: {
        type: ["free", "premium"],
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password;
        if (typeof password !== "string" || password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", { message: "Password must contain at least 6 characters, one uppercase letter, and one lowercase letter." });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole = typeof user.role === "string" ? user.role : "customer";
          if (requestedRole !== "customer" && requestedRole !== "vendor") {
            throw new APIError("BAD_REQUEST", { message: "Public registration is limited to customer and vendor accounts." });
          }
          return { data: { ...user, role: requestedRole } };
        },
      },
      update: {
        before: async (data) => {
          const protectedFields = ["role", "isBlocked", "subscriptionPlan", "subscriptionExpiresAt"];
          if (protectedFields.some((field) => Object.prototype.hasOwnProperty.call(data, field))) {
            throw new APIError("FORBIDDEN", { message: "Account role, status, and subscription are managed by WedPlan administrators and verified payment events." });
          }
          return { data };
        },
      },
    },
  },
  plugins: [jwt()],
});

export type AuthSession = typeof auth.$Infer.Session;
