import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { RESOURCES } from "@/lib/admin/resources";

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const res = RESOURCES[(await params).resource];
  if (!res) notFound();
  return <ResourceManager res={res} />;
}
