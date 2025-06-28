"use client";

import { redirect } from "next/navigation";
import AdminProductList from "@/components/AdminProductList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminProductsPage() {
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/admin/check-status");
      const data = await response.json();

      if (!data.isAdmin) {
        redirect("/");
      }

      setAdminStatus(data.isAdmin);
    } catch (error) {
      console.error("Error checking admin status:", error);
      redirect("/");
    }
  };

  if (adminStatus === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by product name or code..."
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">All Categories</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products List */}
      <AdminProductList searchTerm={searchTerm} />
    </div>
  );
}
