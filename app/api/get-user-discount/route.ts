import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

interface UserDiscount {
  type: 'percentage' | 'free_shipping' | 'fixed';
  value?: number; // pentru discount procentual sau fix
  active: boolean;
  description?: string;
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    // Verificăm dacă utilizatorul este autentificat
    if (!userId) {
      return NextResponse.json(
        { error: "Utilizatorul nu este autentificat" },
        { status: 401 }
      );
    }

    // Obținem clientul Clerk
    const clerk = await clerkClient();
    
    // Obținem utilizatorul și metadatele sale
    const user = await clerk.users.getUser(userId);
    
    // Verificăm dacă există discounturi în lista nouă
    const discounts = user.publicMetadata?.discounts as UserDiscount[] | undefined;
    const activeDiscounts = discounts?.filter(d => d.active) || [];
    
    // Verificăm și discountul legacy pentru compatibilitate
    const singleDiscount = user.publicMetadata?.discount as UserDiscount | undefined;
    if (singleDiscount?.active && !activeDiscounts.some(d => 
        d.type === singleDiscount.type && d.value === singleDiscount.value)) {
      activeDiscounts.push(singleDiscount);
    }
    
    // Verificăm dacă există discounturi active
    if (activeDiscounts.length === 0) {
      return NextResponse.json({ hasDiscounts: false, discounts: [] });
    }

    // Construim răspunsul cu toate discounturile active
    const discountResponse = {
      hasDiscounts: true,
      discounts: activeDiscounts.map((discount, index) => ({
        type: discount.type,
        // Generăm un cod unic pentru fiecare discount
        code: `AUTO_${discount.type.toUpperCase()}_${index + 1}`, 
        value: discount.type === 'percentage' || discount.type === 'fixed' ? discount.value : null,
        canCumulate: true // Acum permitem cumularea discounturilor
      }))
    };
    
    return NextResponse.json(discountResponse);
    
  } catch (error) {
    console.error("Eroare la obținerea discount-urilor utilizatorului:", error);
    return NextResponse.json(
      {
        error: "Eroare la obținerea discount-urilor",
        details: error instanceof Error ? error.message : "Eroare necunoscută",
      },
      { status: 500 }
    );
  }
} 