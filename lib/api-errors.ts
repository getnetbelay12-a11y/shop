import { ZodError } from "zod";

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ZodError) return error.issues[0]?.message ?? fallback;
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") return "Please log in to continue.";
    if (error.message === "FORBIDDEN") return "You do not have access to this action.";
    return error.message || fallback;
  }
  return fallback;
}
