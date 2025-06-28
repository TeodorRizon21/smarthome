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
  Users,
  FileText,
  Settings,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import AdminDashboardStats from "@/components/AdminDashboardStats";

async function getDashboardStats() {
  try {
    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get active discounts
    const activeDiscounts = await prisma.discountCode.count({
      where: {
        OR: [
          {
            expirationDate: {
              gt: new Date(),
            },
          },
          {
            expirationDate: null,
          },
        ],
        usesLeft: {
          gt: 0,
        },
      },
    });

    // Get total revenue from completed orders
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: "COMPLETED",
      },
    });

    return {
      totalProducts,
      totalOrders,
      activeDiscounts,
      totalRevenue: totalRevenue._sum.total || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      activeDiscounts: 0,
      totalRevenue: 0,
    };
  }
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <AdminDashboardStats />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Acțiuni Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/products/new">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <Plus className="h-5 w-5 text-primary" />
              <span className="font-medium">Adaugă Produs Nou</span>
            </button>
          </Link>

          <Link href="/admin/bundles/new">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-medium">Creează Bundle Nou</span>
            </button>
          </Link>

          <Link href="/admin/discount">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <Tag className="h-5 w-5 text-primary" />
              <span className="font-medium">Creează Reducere</span>
            </button>
          </Link>

          <Link href="/admin/newsletter">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-medium">Trimite Newsletter</span>
            </button>
          </Link>

          <Link href="/admin/orders">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">Vezi Comenzi Recente</span>
            </button>
          </Link>

          <Link href="/admin/users">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Gestionare Utilizatori</span>
            </button>
          </Link>

          <Link href="/admin/statistics">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-medium">Rapoarte & Statistici</span>
            </button>
          </Link>

          <Link href="/admin/products">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="font-medium">Gestionare Produse</span>
            </button>
          </Link>

          <Link href="/admin/email-management">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors w-full">
              <Settings className="h-5 w-5 text-primary" />
              <span className="font-medium">Setări Email-uri</span>
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
