import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Plus,
  Image,
  Tag,
  BarChart3,
  Mail,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import MobileMenuButton from "@/components/MobileMenuButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/products/new"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Package className="h-5 w-5" />
              <span>Orders</span>
            </Link>

            <Link
              href="/admin/discount"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Tag className="h-5 w-5" />
              <span>Discounts</span>
            </Link>

            <Link
              href="/admin/bundles"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Package className="h-5 w-5" />
              <span>Smart Bundles</span>
            </Link>

            <Link
              href="/admin/statistics"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Statistics</span>
            </Link>

            <Link
              href="/admin/email-management"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Mail className="h-5 w-5" />
              <span>Email</span>
            </Link>

            <Link
              href="/admin/newsletter"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Mail className="h-5 w-5" />
              <span>Newsletter</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 right-0 left-0 lg:left-64 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
