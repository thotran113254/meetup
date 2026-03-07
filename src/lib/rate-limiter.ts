/** Simple in-memory rate limiter by IP */
const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, maxRequests = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= maxRequests) return false; // blocked
  entry.count++;
  return true; // allowed
}

export function rateLimitResponse() {
  return Response.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
