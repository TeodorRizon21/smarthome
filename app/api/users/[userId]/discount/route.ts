import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";

interface UserDiscount {
  type: 'percentage' | 'free_shipping' | 'fixed';
  value?: number; // pentru discount procentual sau fix
  active: boolean;
  description?: string; // descriere opțională a discountului
}

interface DiscountRequest {
  discount: UserDiscount;
  updateIndex?: number;
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log("Actualizare discount pentru utilizatorul:", params.userId);
    
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      console.log("Utilizatorul nu este admin");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      console.log("Nu s-a găsit ID-ul utilizatorului curent");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as DiscountRequest;
    
    if (!body.discount) {
      return NextResponse.json(
        { error: "Lipsesc datele de discount" },
        { status: 400 }
      );
    }
    
    // Validăm datele de discount
    const discount: UserDiscount = body.discount;
    
    if (!discount.type || !["percentage", "free_shipping", "fixed"].includes(discount.type)) {
      return NextResponse.json(
        { error: "Tip de discount invalid" },
        { status: 400 }
      );
    }
    
    if (discount.type === "percentage" && (!discount.value || discount.value < 1 || discount.value > 100)) {
      return NextResponse.json(
        { error: "Valoare de discount procentual invalidă" },
        { status: 400 }
      );
    }

    if (discount.type === "fixed" && (!discount.value || discount.value <= 0)) {
      return NextResponse.json(
        { error: "Valoare de discount fix invalidă" },
        { status: 400 }
      );
    }
    
    console.log("Datele de discount:", discount);

    // Obținem clientul Clerk
    const clerk = await clerkClient();
    
    try {
      console.log("Actualizare metadata cu Clerk SDK");
      
      // Obținem metadata existentă pentru a o actualiza
      const user = await clerk.users.getUser(params.userId);
      const currentMetadata = user.publicMetadata || {};
      
      // Verificăm dacă există deja discounturi
      let userDiscounts = (currentMetadata.discounts as UserDiscount[]) || [];
      
      // Verificăm dacă actualizăm un discount existent sau adăugăm unul nou
      const updateIndex = body.updateIndex;
      
      if (updateIndex !== undefined && updateIndex >= 0 && Array.isArray(userDiscounts) && updateIndex < userDiscounts.length) {
        // Actualizăm un discount existent
        console.log(`Actualizăm discountul la indexul ${updateIndex}`);
        userDiscounts = Array.isArray(userDiscounts) ? [...userDiscounts] : [];
        userDiscounts[updateIndex] = discount;
      } else {
        // Adăugăm un nou discount
        console.log("Adăugăm un nou discount");
        userDiscounts = Array.isArray(userDiscounts) ? [...userDiscounts, discount] : [discount];
      }
      
      // Actualizăm metadatele
      await clerk.users.updateUser(params.userId, {
        publicMetadata: {
          ...currentMetadata,
          discounts: userDiscounts,
          // Păstrăm și câmpul discount pentru compatibilitate cu implementarea anterioară
          discount: discount
        },
      });
      
      console.log("Discount actualizat cu succes");
      
      // Obținem utilizatorul actualizat pentru a-l returna în răspuns
      const updatedUser = await clerk.users.getUser(params.userId);
      
      return NextResponse.json({
        message: "Discount actualizat cu succes",
        data: {
          id: updatedUser.id,
          publicMetadata: updatedUser.publicMetadata
        },
      });
    } catch (clerkError) {
      console.error("Eroare la actualizarea cu Clerk SDK:", clerkError);
      throw clerkError;
    }

  } catch (error) {
    console.error("Eroare la actualizarea discountului:", error);
    return NextResponse.json(
      {
        error: "Eroare la actualizarea discountului",
        details: error instanceof Error ? error.message : "Eroare necunoscută",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log("Eliminare discounturi pentru utilizatorul:", params.userId);
    
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      console.log("Utilizatorul nu este admin");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      console.log("Nu s-a găsit ID-ul utilizatorului curent");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Obținem clientul Clerk
    const clerk = await clerkClient();
    
    try {
      // Obținem metadata existentă
      const user = await clerk.users.getUser(params.userId);
      const currentMetadata = { ...user.publicMetadata };
      
      // Eliminăm discounturile din metadata
      if (currentMetadata.discount) {
        delete currentMetadata.discount;
      }
      
      if (currentMetadata.discounts) {
        delete currentMetadata.discounts;
      }
      
      // Actualizăm metadatele
      await clerk.users.updateUser(params.userId, {
        publicMetadata: currentMetadata,
      });
      
      console.log("Discounturi eliminate cu succes");
      
      // Obținem utilizatorul actualizat pentru a-l returna în răspuns
      const updatedUser = await clerk.users.getUser(params.userId);
      
      return NextResponse.json({
        message: "Discounturi eliminate cu succes",
        data: {
          id: updatedUser.id,
          publicMetadata: updatedUser.publicMetadata
        },
      });
    } catch (clerkError) {
      console.error("Eroare la eliminarea discounturilor:", clerkError);
      throw clerkError;
    }

  } catch (error) {
    console.error("Eroare la eliminarea discounturilor:", error);
    return NextResponse.json(
      {
        error: "Eroare la eliminarea discounturilor",
        details: error instanceof Error ? error.message : "Eroare necunoscută",
      },
      { status: 500 }
    );
  }
} 