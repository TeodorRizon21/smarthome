import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET pentru a obține toate bundle-urile publice
export async function GET() {
  try {
    console.log("Fetching public bundles...");
    const bundles = await prisma.bundle.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${bundles.length} bundles`);
    return NextResponse.json(bundles);
  } catch (error) {
    console.error("Error fetching bundles:", error);
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
      { status: 500 }
    );
  }
} 