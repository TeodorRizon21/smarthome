import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const bundle = await prisma.bundle.findUnique({
    where: { id: params.id },
  });

  if (!bundle) {
    return {
      title: "Bundle negăsit",
    };
  }

  return {
    title: `${bundle.name} | Smart Home Bundle`,
    description: bundle.description,
  };
} 