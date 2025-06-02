import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import UserList from "@/components/UserList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

export default async function AdminUsersPage() {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/admin">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la Panoul de Administrare
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-8">Gestionare Utilizatori</h1>

      <Suspense
        fallback={
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex justify-center items-center min-h-[300px]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-gray-500">Se încarcă utilizatorii...</p>
            </div>
          </div>
        }
      >
        <UserListContent />
      </Suspense>
    </div>
  );
}

async function UserListContent() {
  let users = [];
  let pagination = null;
  let error = null;

  try {
    // Fetch users from our API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users?page=1&limit=10`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Eroare la încărcarea utilizatorilor");
    }

    const data = await response.json();
    users = data.data || [];
    pagination = data.pagination;
  } catch (err) {
    console.error("Eroare la încărcarea utilizatorilor:", err);
    error = err instanceof Error ? err.message : "A apărut o eroare";
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Eroare</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <UserList initialUsers={users} initialPagination={pagination} />
    </div>
  );
}
