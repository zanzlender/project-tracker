import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(100, "10s"),
  ephemeralCache: new Map(),
  prefix: "@upstash/ratelimit",
  analytics: true,
});

const isPublicRoute = createRouteMatcher([
  "/auth(.*)",
  "/",
  "/api/webhooks(.*)",
]);

const shouldSkipRouterForRateLimiting = createRouteMatcher([
  "/(?!(api|trpc).*)", // any router that doesn't start with api or trpc
]);

export default clerkMiddleware(async (auth, request, event) => {
  const ip = request.ip ?? "127.0.0.1";
  console.log("RUNNING MIDDLEWARE for: ", request.url);
  const { success, pending, limit, remaining } = await ratelimit.limit(ip);
  // we use context.waitUntil since analytics: true.
  // see https://upstash.com/docs/oss/sdks/ts/ratelimit/gettingstarted#serverless-environments
  event.waitUntil(pending);

  const res =
    success || shouldSkipRouterForRateLimiting(request)
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/api/blocked", request.url));

  res.headers.set("X-RateLimit-Success", success.toString());
  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());

  if (!isPublicRoute(request)) {
    auth().protect();
  }
  return res;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // and /monitoring for Vercel Speed insigts
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
