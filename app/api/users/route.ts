import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";
import { Clerk } from "@clerk/clerk-sdk-node";

const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    console.log("Starting user fetch...");
    
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      console.log("User is not admin");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await auth();
    if (!userId) {
      console.log("No user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')?.toString() || "1");
    const limit = parseInt(searchParams.get('limit')?.toString() || "10");
    const offset = (page - 1) * limit;

    console.log("Fetching users using Clerk SDK...");

    try {
      const usersResponse = await clerkClient.users.getUserList({
        limit: limit,
        offset: offset,
      });
      
      console.log("Successfully fetched users with Clerk SDK, count:", usersResponse.length);
      
      // Transformă metadata la formatul așteptat de front-end
      const transformedUsers = usersResponse.map((user) => ({
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
      const totalCount = await clerkClient.users.getCount();
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