import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminBundleList from "@/components/AdminBundleList";

export default async function AdminBundlesPage() {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Bundles</h1>
          <p className="text-gray-500">
            Creează și gestionează pachete de produse smart home
          </p>
        </div>
        <Link href="/admin/bundles/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Bundle Nou
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Caută bundle-uri..."
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Sortează după</option>
            <option value="newest">Cele mai noi</option>
            <option value="oldest">Cele mai vechi</option>
            <option value="price-asc">Preț: Crescător</option>
            <option value="price-desc">Preț: Descrescător</option>
          </select>
        </div>
      </div>

      {/* Bundles List */}
      <AdminBundleList />
    </div>
  );
}
