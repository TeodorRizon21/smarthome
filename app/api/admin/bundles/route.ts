import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// GET pentru a obține toate bundle-urile
export async function GET() {
  try {
    const adminStatus = await isAdmin();
    
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    return NextResponse.json(bundles);
  } catch (error) {
    console.error("Error fetching bundles:", error);
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
      { status: 500 }
    );
  }
}

// POST pentru a crea un nou bundle
export async function POST(request: Request) {
  try {
    const adminStatus = await isAdmin();
    
    if (!adminStatus) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, price, oldPrice, stock, discount, allowOutOfStock, images, items } = body;

    if (!name || !description || items.length === 0 || images.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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

    try {
      // Creăm bundle-ul fără items inițial
      const newBundle = await prisma.bundle.create({
        data: {
          name,
          description,
          price: parseFloat(price.toString()),
          oldPrice: oldPrice ? parseFloat(oldPrice.toString()) : null,
          stock: stock || 100,
          discount: discount || null,
          allowOutOfStock: allowOutOfStock || false,
          images,
        },
      });

      // Adăugăm produsele separat
      for (const item of items) {
        await prisma.bundleItem.create({
          data: {
            bundleId: newBundle.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }

      // Obținem bundle-ul complet cu relații
      const completeBundle = await prisma.bundle.findUnique({
        where: { id: newBundle.id },
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

      return NextResponse.json(completeBundle);
    } catch (innerError) {
      console.error("Error within transaction:", innerError);
      throw innerError;
    }
  } catch (error) {
    console.error("Error creating bundle:", error);
    return NextResponse.json(
      { error: "Failed to create bundle" },
      { status: 500 }
    );
  }
} 