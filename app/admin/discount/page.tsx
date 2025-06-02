import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DiscountManager from "@/components/DiscountManager";

export default async function AdminDiscountPage() {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/admin">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-8">Manage Discount Codes</h1>
      <DiscountManager />
    </div>
  );
}
