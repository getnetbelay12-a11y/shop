import { ZodError } from "zod";

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ZodError) return error.issues[0]?.message ?? fallback;
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") return "Please log in to continue.";
    if (error.message === "FORBIDDEN") return "You do not have access to this action.";
    if (error.message.includes("MONGO_URI is not configured") || error.message.includes("MONGODB_URI") || error.message.includes("MongoDB connection string is not configured")) {
      return "Server setup is incomplete. Add a MongoDB connection string in the environment settings and restart the app.";
    }
    return error.message || fallback;
  }
  return fallback;
}
