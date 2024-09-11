/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { withPlausibleProxy } from "next-plausible";

await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["yjs"],
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default config;
