import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    // Verificăm dacă utilizatorul este autentificat
    if (!userId) {
      return NextResponse.json({
        error: "Utilizatorul nu este autentificat",
        authenticated: false
      });
    }

    // Obținem clientul Clerk
    const clerk = await clerkClient();
    
    // Obținem utilizatorul și metadatele sale
    const user = await clerk.users.getUser(userId);
    
    return NextResponse.json({
      message: "Testare funcționalitate discount automat",
      userId: userId,
      userEmail: user.emailAddresses[0]?.emailAddress,
      userMetadata: user.publicMetadata,
      hasDiscount: !!user.publicMetadata?.discount && (user.publicMetadata.discount as any).active === true,
      discountDetails: user.publicMetadata?.discount || null
    });
    
  } catch (error) {
    console.error("Eroare la testarea discount-ului:", error);
    return NextResponse.json(
      {
        error: "Eroare la testarea discount-ului",
        details: error instanceof Error ? error.message : "Eroare necunoscută",
      },
      { status: 500 }
    );
  }
} 