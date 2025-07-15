import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminStatus = await isAdmin();
    
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bundleId = params.id;

    const bundle = await prisma.bundle.findUnique({
      where: {
        id: bundleId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!bundle) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bundle);
  } catch (error) {
    console.error("Error fetching bundle:", error);
    return NextResponse.json(
      { error: "Failed to fetch bundle" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminStatus = await isAdmin();
    
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bundleId = params.id;
    const body = await request.json();
    const { name, description, price, oldPrice, discount, images, items } = body;

    if (!name || !description || items.length === 0 || images.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verificăm dacă bundle-ul există
    const existingBundle = await prisma.bundle.findUnique({
      where: {
        id: bundleId,
      },
    });

    if (!existingBundle) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      );
    }

    // Verificăm dacă toate produsele există
    const productIds = items.map((item: any) => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (existingProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products do not exist" },
        { status: 400 }
      );
    }

    // Actualizăm bundle-ul
    const bundle = await prisma.bundle.update({
      where: {
        id: bundleId,
      },
      data: {
        name,
        description,
        price,
        oldPrice,
        discount,
        images,
        items: {
          deleteMany: {}, // Ștergem toate item-urile existente
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
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
    });

    return NextResponse.json(bundle);
  } catch (error) {
    console.error("Error updating bundle:", error);
    return NextResponse.json(
      { error: "Failed to update bundle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminStatus = await isAdmin();
    
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bundleId = params.id;

    // Verificăm dacă bundle-ul există
    const existingBundle = await prisma.bundle.findUnique({
      where: {
        id: bundleId,
      },
    });

    if (!existingBundle) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      );
    }

    // Ștergem bundle-ul (BundleItems vor fi șterse automat datorită relației onDelete: Cascade)
    await prisma.bundle.delete({
      where: {
        id: bundleId,
      },
    });

    return NextResponse.json(
      { message: "Bundle deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bundle:", error);
    return NextResponse.json(
      { error: "Failed to delete bundle" },
      { status: 500 }
    );
  }
} 