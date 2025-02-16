import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Staging from "./_components/staging";
import PricingSection from "./_components/pricing-section";
import OverviewSection from "./_components/overview-section";
import { TracingBeam } from "./_components/tracing-beam";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <Staging />
      <TracingBeam>
        <OverviewSection />
        <PricingSection session={session} />
      </TracingBeam>
    </HydrateClient>
  );
}
