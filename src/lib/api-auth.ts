import { NextRequest } from "next/server";
import { rateLimit, rateLimitResponse } from "./rate-limiter";

/** Validate API key from Authorization header */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = process.env.API_SECRET_KEY;
  if (!apiKey) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${apiKey}`;
}

/** Return 401 JSON response */
export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

/** Combined auth + rate limit check. Returns error Response or null if OK */
export function checkApiAccess(request: NextRequest): Response | null {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) return rateLimitResponse();
  if (!validateApiKey(request)) return unauthorizedResponse();
  return null; // all checks passed
}
