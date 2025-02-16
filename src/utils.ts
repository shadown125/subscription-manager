import type { ClassValue } from "clsx";

import clsx from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { hash, compare } from "bcryptjs";

const COMMON_UNITS = ["small", "medium", "large"];

/**
 * We need to extend the tailwind merge to include NextUI's custom classes.
 *
 * So we can use classes like `text-small` or `text-default-500` and override them.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      opacity: ["disabled"],
      spacing: ["divider"],
      borderWidth: COMMON_UNITS,
      borderRadius: COMMON_UNITS,
    },
    classGroups: {
      shadow: [{ shadow: COMMON_UNITS }],
      "font-size": [{ text: ["tiny", ...COMMON_UNITS] }],
      "bg-image": ["bg-stripe-gradient"],
    },
  },
});

export const textPrettify = (text: string) => {
  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).replace(/_/g, " ").toLowerCase()
  );
};

export function getAbsoluteUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://www.easycook.app`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(password: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return await compare(password, hashedPassword);
}

const idToRequestCount = new Map<string, number>(); // keeps track of individual users
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 24 * 60 * 60 * 1000, // Milliseconds (currently 1 Hour)
  maxRequests: 1,
};

export const rateLimit = (ip: string) => {
  // Check and update current window
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    idToRequestCount.set(ip, 0);
  }

  // Check and update current request limits
  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};
