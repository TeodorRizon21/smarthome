import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log("Actualizare rol pentru utilizatorul:", params.userId);
    
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

    const body = await request.json();
    
    // Verificăm ce rol se modifică
    const isChangingAdmin = body.isAdmin !== undefined;
    const isChangingModerator = body.isModerator !== undefined;
    
    // Verificăm dacă utilizatorul încearcă să își modifice propriul rol
    if (params.userId === currentUserId && isChangingAdmin) {
      console.log("Utilizatorul încearcă să-și modifice propriul rol de admin");
      return NextResponse.json(
        { error: "Nu poți modifica propriul rol de admin" },
        { status: 403 }
      );
    }

    console.log("Obținem datele utilizatorului folosind Clerk SDK");
    
    // Obținem datele actuale ale utilizatorului pentru a verifica dacă e admin
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(params.userId);
    
    // Nu permitem retragerea rolului de moderator de la un admin
    if (isChangingModerator && !body.isModerator && user.publicMetadata?.isAdmin === true) {
      console.log("Încercare de a retrage rolul de moderator unui admin");
      return NextResponse.json(
        { error: "Nu poți retrage rolul de moderator unui administrator" },
        { status: 403 }
      );
    }

    // Preparăm datele pentru actualizare
    const metadata: Record<string, any> = {};
    
    if (isChangingAdmin) {
      metadata.isAdmin = body.isAdmin;
    }
    
    if (isChangingModerator) {
      metadata.isModerator = body.isModerator;
    }
    
    console.log("Actualizare metadata:", metadata);

    // Folosim direct SDK-ul Clerk pentru actualizare
    try {
      console.log("Actualizare metadata cu Clerk SDK");
      await clerk.users.updateUser(params.userId, {
        publicMetadata: metadata,
      });
      
      console.log("Rol actualizat cu succes");
      
      // Obținem utilizatorul actualizat pentru a-l returna în răspuns
      const updatedUser = await clerk.users.getUser(params.userId);
      
      return NextResponse.json({
        message: "Rol actualizat cu succes",
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
    console.error("Eroare la actualizarea rolului:", error);
    return NextResponse.json(
      {
        error: "Eroare la actualizarea rolului",
        details: error instanceof Error ? error.message : "Eroare necunoscută",
      },
      { status: 500 }
    );
  }
} 