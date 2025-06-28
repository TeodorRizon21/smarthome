"use client";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Package,
  ShoppingBag,
  Plus,
  Image,
  Tag,
  BarChart3,
  Mail,
  LayoutDashboard,
} from "lucide-react";

export default function AdminPage() {
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);

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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>
              <h3 className="text-2xl font-bold mt-1">24</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold mt-1">156</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Discounts
              </p>
              <h3 className="text-2xl font-bold mt-1">3</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Tag className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">$12,345</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/products/new">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors">
              <Plus className="h-5 w-5 text-primary" />
              <span className="font-medium">Add New Product</span>
            </button>
          </Link>
          <Link href="/admin/discount">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors">
              <Tag className="h-5 w-5 text-primary" />
              <span className="font-medium">Create Discount</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">New product added</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">New order received</p>
              <p className="text-sm text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Email template updated</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
