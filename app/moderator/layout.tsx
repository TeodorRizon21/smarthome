import { redirect } from "next/navigation";
import { canAccessModeration } from "@/lib/auth";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await canAccessModeration();

  if (!hasAccess) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main>
        {/* Page Content */}
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
