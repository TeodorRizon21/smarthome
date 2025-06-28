"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Package, Tag, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  activeDiscounts: number;
  totalRevenue: number;
};

export default function AdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    activeDiscounts: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/dashboard-stats", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Produse</p>
            <h3 className="text-2xl font-bold mt-1">
              {isLoading ? "..." : stats.totalProducts}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Comenzi</p>
            <h3 className="text-2xl font-bold mt-1">
              {isLoading ? "..." : stats.totalOrders}
            </h3>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Package className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Reduceri Active</p>
            <h3 className="text-2xl font-bold mt-1">
              {isLoading ? "..." : stats.activeDiscounts}
            </h3>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <Tag className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Venit Total</p>
            <h3 className="text-2xl font-bold mt-1">
              {isLoading ? "..." : formatCurrency(stats.totalRevenue)}
            </h3>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
