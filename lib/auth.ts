import { auth as clerkAuth, currentUser as clerkUser } from "@clerk/nextjs/server";

export async function isAdmin() {
  const authResult = await clerkAuth();
  const userId = authResult.userId;
  if (!userId) {
    console.log("No userId found in auth result");
    return false;
  }
  
  const user = await clerkUser();
  console.log("User metadata:", {
    userId: user?.id,
    metadata: user?.publicMetadata,
    isAdmin: user?.publicMetadata?.isAdmin
  });
  
  return user?.publicMetadata?.isAdmin === true;
}

export async function isModerator() {
  const authResult = await clerkAuth();
  const userId = authResult.userId;
  if (!userId) return false;
  
  const user = await clerkUser();
  // Adminii sunt automat și moderatori
  return user?.publicMetadata?.isAdmin === true || user?.publicMetadata?.isModerator === true;
}

export async function canAccessModeration() {
  return await isModerator();
}

