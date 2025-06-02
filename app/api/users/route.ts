import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    console.log("Starting user fetch...");
    
    // Comentăm temporar verificările de admin pentru a testa
    // const adminStatus = await isAdmin();
    // if (!adminStatus) {
    //   console.log("User is not admin");
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const { userId } = await auth();
    // if (!userId) {
    //   console.log("No user ID found");
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Log all environment variables (except secret keys)
    console.log("All available environment variables:", {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      CLERK_API_URL: process.env.CLERK_API_URL,
      HAS_CLERK_SECRET: process.env.CLERK_SECRET_KEY ? "Yes" : "No"
    });

    console.log("Fetching users using Clerk SDK...");

    try {
      // Obținem clientul Clerk
      const clerk = await clerkClient();
      
      // Obținem utilizatorii direct prin SDK
      const usersResponse = await clerk.users.getUserList({
        limit: limit,
        offset: offset,
      });
      
      // În versiunea nouă a Clerk, răspunsul este array de utilizatori
      const users = usersResponse.data || [];
      
      console.log("Successfully fetched users with Clerk SDK, count:", users.length);
      
      // Transformă metadata la formatul așteptat de front-end
      const transformedUsers = users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddresses: user.emailAddresses.map((email) => ({ 
          emailAddress: email.emailAddress 
        })),
        createdAt: user.createdAt,
        publicMetadata: user.publicMetadata,
        imageUrl: user.imageUrl,
      }));
      
      // Obținem numărul total de utilizatori pentru paginare
      // Deși SDK poate oferi count total, folosim o estimare simplă
      const totalCount = usersResponse.totalCount || users.length + offset; 
      const totalPages = Math.ceil(totalCount / limit);
      
      return NextResponse.json({
        data: transformedUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit
        }
      });
      
    } catch (fetchError) {
      console.error("Clerk SDK error details:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 