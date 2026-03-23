import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientWrapper from "@/components/ClientWrapper";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  return <ClientWrapper />;
}