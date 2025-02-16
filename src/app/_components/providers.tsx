// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>;
}
