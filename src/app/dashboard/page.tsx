import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import DashboardSection from "./_components/dashboard-section";
import CreateAndModifyPopup from "./_components/create-and-modify-popup";

export default async function Home() {
  const session = await auth();

  if (!session) redirect("/");

  const user = await api.user.get();

  if (!user?.isPaid) redirect("/#pricing");

  return (
    <HydrateClient>
      <DashboardSection />
      <CreateAndModifyPopup />
    </HydrateClient>
  );
}
