"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Definiții pentru comanda de produse
type OrderItem = {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  color: string;
  price: number;
  image: string;
  product?: {
    colorVariants: Array<{
      id: string;
      productCode: string;
      color: string;
      price: number;
      oldPrice: number | null;
    }>;
  };
};

// Definiții pentru comanda de bundle-uri
type BundleOrderItem = {
  id: string;
  bundleId: string;
  quantity: number;
  price: number;
  bundle: {
    name: string;
    images: string[];
    items: {
      id: string;
      quantity: number;
      product: {
        name: string;
        images: string[];
      };
    }[];
  };
};

type OrderDetails = {
  fullName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  notes?: string;
  isCompany: boolean;
  companyName?: string;
  companyCUI?: string;
  companyRegNumber?: string;
  companyCounty?: string;
  companyCity?: string;
  companyAddress?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
  bundleOrders: BundleOrderItem[];
  paymentStatus: string;
  orderStatus: string;
  orderType: string;
  paymentType: string;
  courier: string | null;
  awb: string | null;
  details: OrderDetails;
  discountCodes: {
    code: string;
    type: string;
    value: number;
  }[];
};

// Componenta pentru afișarea unui produs din comandă
const ProductCard = ({ item }: { item: OrderItem }) => {
  const variant = item.product?.colorVariants?.find(
    (v) => v.color === item.color
  );

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <Image
        src={item.image}
        alt={item.productName}
        width={60}
        height={60}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <h4 className="font-medium">{item.productName}</h4>
        <p className="text-sm text-gray-500">
          Variant:{" "}
          {variant ? `${variant.color} (${variant.productCode})` : item.color}
        </p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{item.price.toFixed(2)} RON</p>
        <p className="text-sm text-gray-500">
          Total: {(item.price * item.quantity).toFixed(2)} RON
        </p>
      </div>
    </div>
  );
};

// Componenta pentru afișarea unui bundle din comandă
const BundleCard = ({ item }: { item: BundleOrderItem }) => (
  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-4 mb-2">
      <Image
        src={item.bundle.images[0] || "/placeholder.svg"}
        alt={item.bundle.name}
        width={60}
        height={60}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <h4 className="font-medium">{item.bundle.name}</h4>
        <p className="text-sm text-gray-500">Cantitate: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{item.price.toFixed(2)} RON</p>
        <p className="text-sm text-gray-500">
          Total: {(item.price * item.quantity).toFixed(2)} RON
        </p>
      </div>
    </div>

    <div className="mt-2 border-t pt-2">
      <h5 className="text-sm font-medium mb-2">Produse incluse:</h5>
      <div className="space-y-1">
        {item.bundle.items.map((bundleItem) => (
          <div key={bundleItem.id} className="text-sm flex justify-between">
            <span>
              {bundleItem.quantity} x {bundleItem.product.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

type AdminOrderListProps = {
  orderType: "product" | "bundle";
};

export default function AdminOrderList({ orderType }: AdminOrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [courier, setCourier] = useState<string>("");
  const [awb, setAwb] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [completionFilter, setCompletionFilter] = useState<
    "all" | "completed" | "uncompleted"
  >("all");
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<
    "delete" | "fulfill" | "cancel" | null
  >(null);

  // Lista de județe din România
  const counties = [
    "Alba",
    "Arad",
    "Arges",
    "Bacau",
    "Bihor",
    "Bistrita-Nasaud",
    "Botosani",
    "Braila",
    "Brasov",
    "Bucuresti",
    "Buzau",
    "Calarasi",
    "Caras-Severin",
    "Cluj",
    "Constanta",
    "Covasna",
    "Dambovita",
    "Dolj",
    "Galati",
    "Giurgiu",
    "Gorj",
    "Harghita",
    "Hunedoara",
    "Ialomita",
    "Iasi",
    "Ilfov",
    "Maramures",
    "Mehedinti",
    "Mures",
    "Neamt",
    "Olt",
    "Prahova",
    "Salaj",
    "Satu Mare",
    "Sibiu",
    "Suceava",
    "Teleorman",
    "Timis",
    "Tulcea",
    "Valcea",
    "Vaslui",
    "Vrancea",
  ];

  // Lista de categorii de produse
  const categories = [
    { value: "", label: "Toate categoriile" },
    { value: "all-products", label: "All products" },
    { value: "smart-residence", label: "Smart Residence" },
    { value: "smart-comercial", label: "Smart Comercial" },
    { value: "smart-intercom", label: "Smart Intercom" },
    { value: "smart-lightning", label: "Smart Lightning" },
    { value: "sales", label: "SALES" },
  ];

  // Lista de luni
  const months = [
    { value: "1", label: "Ianuarie" },
    { value: "2", label: "Februarie" },
    { value: "3", label: "Martie" },
    { value: "4", label: "Aprilie" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Iunie" },
    { value: "7", label: "Iulie" },
    { value: "8", label: "August" },
    { value: "9", label: "Septembrie" },
    { value: "10", label: "Octombrie" },
    { value: "11", label: "Noiembrie" },
    { value: "12", label: "Decembrie" },
  ];

  // Extragem anii și lunile disponibile din comenzile existente
  const availableYearsAndMonths = useMemo(() => {
    const yearsSet = new Set<string>();
    const monthsByYear = new Map<string, Set<string>>();

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();

      yearsSet.add(year);

      if (!monthsByYear.has(year)) {
        monthsByYear.set(year, new Set<string>());
      }
      monthsByYear.get(year)?.add(month);
    });

    return {
      years: Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a)),
      monthsByYear,
    };
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, [orderType]);

  // Resetăm luna când se schimbă anul
  useEffect(() => {
    setSelectedMonth("");
  }, [selectedYear]);

  useEffect(() => {
    let filtered = orders;

    // Filtrare după text
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        // Caută în ID comandă
        if (order.id.toLowerCase().includes(query)) return true;

        // Caută în detalii client
        if (order.details.fullName.toLowerCase().includes(query)) return true;
        if (order.details.email.toLowerCase().includes(query)) return true;
        if (order.details.phoneNumber.toLowerCase().includes(query))
          return true;
        if (order.details.street.toLowerCase().includes(query)) return true;
        if (order.details.city.toLowerCase().includes(query)) return true;
        if (order.details.county.toLowerCase().includes(query)) return true;
        if (order.details.postalCode.toLowerCase().includes(query)) return true;

        // Caută în detalii firmă (dacă există)
        if (order.details.isCompany) {
          if (order.details.companyName?.toLowerCase().includes(query))
            return true;
          if (order.details.companyCUI?.toLowerCase().includes(query))
            return true;
          if (order.details.companyRegNumber?.toLowerCase().includes(query))
            return true;
          if (order.details.companyAddress?.toLowerCase().includes(query))
            return true;
          if (order.details.companyCity?.toLowerCase().includes(query))
            return true;
          if (order.details.companyCounty?.toLowerCase().includes(query))
            return true;
        }

        // Caută în status comandă
        if (order.orderStatus.toLowerCase().includes(query)) return true;
        if (order.paymentStatus.toLowerCase().includes(query)) return true;

        // Caută în detalii livrare
        if (order.courier?.toLowerCase().includes(query)) return true;
        if (order.awb?.toLowerCase().includes(query)) return true;

        // Caută în produse
        if (
          order.items.some(
            (item) =>
              item.productName.toLowerCase().includes(query) ||
              item.color.toLowerCase().includes(query)
          )
        )
          return true;

        // Caută în bundle-uri
        if (
          order.bundleOrders.some((bundle) =>
            bundle.bundle.name.toLowerCase().includes(query)
          )
        )
          return true;

        return false;
      });
    }

    // Filtrare după județ
    if (selectedCounty) {
      filtered = filtered.filter(
        (order) =>
          order.details.county.toLowerCase() === selectedCounty.toLowerCase() ||
          (order.details.isCompany &&
            order.details.companyCounty?.toLowerCase() ===
              selectedCounty.toLowerCase())
      );
    }

    // Filtrare după categorie
    if (selectedCategory) {
      filtered = filtered.filter((order) => {
        // Verifică dacă comanda conține produse din categoria selectată
        const hasProductsInCategory = order.items.some((item) => {
          const productCategory = item.productName.toLowerCase();
          switch (selectedCategory) {
            case "all-products":
              return true;
            case "smart-residence":
              return (
                productCategory.includes("residence") ||
                productCategory.includes("smart residence")
              );
            case "smart-comercial":
              return (
                productCategory.includes("comercial") ||
                productCategory.includes("smart comercial")
              );
            case "smart-intercom":
              return (
                productCategory.includes("intercom") ||
                productCategory.includes("smart intercom")
              );
            case "smart-lightning":
              return (
                productCategory.includes("lightning") ||
                productCategory.includes("smart lightning")
              );
            case "sales":
              return (
                productCategory.includes("sale") ||
                productCategory.includes("reducere")
              );
            default:
              return true;
          }
        });

        // Verifică și în bundle-uri
        const hasBundlesInCategory = order.bundleOrders.some((bundle) => {
          const bundleCategory = bundle.bundle.name.toLowerCase();
          switch (selectedCategory) {
            case "all-products":
              return true;
            case "smart-residence":
              return (
                bundleCategory.includes("residence") ||
                bundleCategory.includes("smart residence")
              );
            case "smart-comercial":
              return (
                bundleCategory.includes("comercial") ||
                bundleCategory.includes("smart comercial")
              );
            case "smart-intercom":
              return (
                bundleCategory.includes("intercom") ||
                bundleCategory.includes("smart intercom")
              );
            case "smart-lightning":
              return (
                bundleCategory.includes("lightning") ||
                bundleCategory.includes("smart lightning")
              );
            case "sales":
              return (
                bundleCategory.includes("sale") ||
                bundleCategory.includes("reducere")
              );
            default:
              return true;
          }
        });

        return hasProductsInCategory || hasBundlesInCategory;
      });
    }

    // Filtrare după an
    if (selectedYear) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const orderYear = orderDate.getFullYear().toString();
        return orderYear === selectedYear;
      });
    }

    // Filtrare după lună (doar dacă este selectat un an)
    if (selectedYear && selectedMonth) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const orderMonth = (orderDate.getMonth() + 1).toString(); // +1 pentru că getMonth() returnează 0-11
        return orderMonth === selectedMonth;
      });
    }

    // Filtrare după statusul de finalizare
    if (completionFilter !== "all") {
      filtered = filtered.filter((order) => {
        const isCompleted = order.orderStatus === "Comanda finalizata!";
        return completionFilter === "completed" ? isCompleted : !isCompleted;
      });
    }

    setFilteredOrders(filtered);
  }, [
    searchQuery,
    selectedCounty,
    selectedCategory,
    selectedYear,
    selectedMonth,
    completionFilter,
    orders,
  ]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/admin/orders?type=${orderType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: `Failed to fetch ${orderType} orders. Please try again later.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFulfillOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/fulfill`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                orderStatus: updatedOrder.orderStatus,
                paymentStatus: updatedOrder.paymentStatus,
              }
            : order
        )
      );
      toast({
        title: "Success",
        description:
          updatedOrder.orderStatus === "Comanda finalizata!"
            ? "Order marked as fulfilled."
            : "Order unfulfilled.",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      setOrders(orders.filter((order) => order.id !== orderId));
      toast({
        title: "Success",
        description: `${
          orderType === "product" ? "Product" : "Bundle"
        } order deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: `Failed to delete ${orderType} order. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setDeleteOrderId(null);
    }
  };

  const handleUpdateOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courier,
          awb,
          orderStatus: "Comanda se indreapta catre tine!",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                courier,
                awb,
                orderStatus: "Comanda se indreapta catre tine!",
              }
            : order
        )
      );
      setEditingOrder(null);
      toast({
        title: "Success",
        description: `${
          orderType === "product" ? "Product" : "Bundle"
        } order updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: `Failed to update ${orderType} order. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      toast({
        title: "Success",
        description: `${
          orderType === "product" ? "Product" : "Bundle"
        } order status updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: `Failed to update ${orderType} order status. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Calculăm statisticile pentru comenzile filtrate
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      averageOrder,
    };
  }, [filteredOrders]);

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;

    try {
      switch (bulkAction) {
        case "delete":
          await Promise.all(
            selectedOrders.map((orderId) => handleDeleteOrder(orderId))
          );
          break;
        case "fulfill":
          await Promise.all(
            selectedOrders.map((orderId) => handleFulfillOrder(orderId))
          );
          break;
        case "cancel":
          await Promise.all(
            selectedOrders.map((orderId) =>
              handleStatusChange(orderId, "Comanda anulată")
            )
          );
          break;
      }

      setSelectedOrders([]);
      setBulkAction(null);
      setBulkActionDialogOpen(false);
      await fetchOrders();
      toast({
        title: "Succes!",
        description: "Operațiunea în bulk a fost efectuată cu succes.",
      });
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la efectuarea operațiunii în bulk.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading {orderType} orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        Nu există comenzi de{" "}
        {orderType === "product" ? "produse" : "bundle-uri"}.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="selectAll"
            checked={
              selectedOrders.length === filteredOrders.length &&
              filteredOrders.length > 0
            }
            onCheckedChange={handleSelectAll}
          />
          <Label htmlFor="selectAll" className="text-sm font-medium">
            Selectează toate ({filteredOrders.length})
          </Label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedOrders.length > 0 && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setBulkAction("delete");
                  setBulkActionDialogOpen(true);
                }}
                className="whitespace-nowrap"
              >
                Șterge ({selectedOrders.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBulkAction("fulfill");
                  setBulkActionDialogOpen(true);
                }}
                className="whitespace-nowrap"
              >
                Îndeplinește ({selectedOrders.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBulkAction("cancel");
                  setBulkActionDialogOpen(true);
                }}
                className="whitespace-nowrap"
              >
                Anulează ({selectedOrders.length})
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        {/* Panou de statistici */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  Număr Comenzi
                </p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Venit Total</p>
                <p className="text-2xl font-bold">
                  {stats.totalRevenue.toFixed(2)} RON
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  Comandă Medie
                </p>
                <p className="text-2xl font-bold">
                  {stats.averageOrder.toFixed(2)} RON
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Caută comenzi după ID, client, produs, firmă, status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                ×
              </Button>
            )}
          </div>

          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Toate județele</option>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Toți anii</option>
            {availableYearsAndMonths.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border rounded-md"
            disabled={!selectedYear}
          >
            <option value="">Toate lunile</option>
            {selectedYear &&
            availableYearsAndMonths.monthsByYear.get(selectedYear)?.size
              ? Array.from(
                  availableYearsAndMonths.monthsByYear.get(selectedYear) || []
                )
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((month) => (
                    <option key={month} value={month}>
                      {months.find((m) => m.value === month)?.label}
                    </option>
                  ))
              : null}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <RadioGroup
            value={completionFilter}
            onValueChange={(value) =>
              setCompletionFilter(value as "all" | "completed" | "uncompleted")
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Toate comenzile</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed">Doar finalizate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="uncompleted" id="uncompleted" />
              <Label htmlFor="uncompleted">Doar nefinalizate</Label>
            </div>
          </RadioGroup>
        </div>

        {(searchQuery ||
          selectedCounty ||
          selectedCategory ||
          selectedYear ||
          selectedMonth ||
          completionFilter !== "all") && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredOrders.length} comenzi găsite
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCounty("");
                setSelectedCategory("");
                setSelectedYear("");
                setSelectedMonth("");
                setCompletionFilter("all");
              }}
            >
              Resetează filtrele
            </Button>
          </div>
        )}
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {filteredOrders.map((order) => (
          <AccordionItem
            key={order.id}
            value={order.id}
            className="border rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center px-4 py-2">
              <Checkbox
                checked={selectedOrders.includes(order.id)}
                onCheckedChange={() => handleSelectOrder(order.id)}
                className="mr-4"
              />
              <AccordionTrigger className="flex-1 hover:no-underline">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 text-left">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        Comanda {order.orderNumber}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({new Date(order.createdAt).toLocaleDateString("ro-RO")}
                        )
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {order.details.fullName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus === "COMPLETED"
                        ? "Plătit"
                        : "În așteptare"}
                    </span>
                    <span className="font-medium">
                      {order.total.toFixed(2)} RON
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Order Status
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Payment Status:</p>
                        <p className="text-sm font-medium">
                          {order.paymentStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Order Status:</p>
                        <p className="text-sm font-medium">
                          {order.orderStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Method:</p>
                        <p className="text-sm font-medium">
                          {order.paymentType === "card"
                            ? "Plată cu cardul"
                            : "Ramburs la curier"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Customer Details
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Name:</p>
                        <p className="text-sm font-medium">
                          {order.details.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email:</p>
                        <p className="text-sm font-medium">
                          {order.details.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone:</p>
                        <p className="text-sm font-medium">
                          {order.details.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Address:</p>
                        <p className="text-sm font-medium">
                          {order.details.street}, {order.details.city},{" "}
                          {order.details.county}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <ProductCard key={item.id} item={item} />
                    ))}
                    {order.bundleOrders?.map((item) => (
                      <BundleCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                  {editingOrder === order.id ? (
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Courier
                          </label>
                          <Input
                            value={courier}
                            onChange={(e) => setCourier(e.target.value)}
                            placeholder="e.g. Fan Courier"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            AWB
                          </label>
                          <Input
                            value={awb}
                            onChange={(e) => setAwb(e.target.value)}
                            placeholder="AWB number"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleUpdateOrder(order.id)}
                            className="flex-1"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingOrder(null)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button
                      onClick={() => {
                        setEditingOrder(order.id);
                        setCourier(order.courier || "");
                        setAwb(order.awb || "");
                      }}
                      className="w-full"
                    >
                      {order.courier && order.awb
                        ? "Update Shipping Info"
                        : "Add Shipping Info"}
                    </Button>
                  )}
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="p-2 border rounded w-full"
                  >
                    <option value="Comanda este in curs de procesare">
                      În curs de procesare
                    </option>
                    <option value="Comanda se indreapta catre tine!">
                      Se îndreaptă către tine
                    </option>
                    <option value="Comanda finalizata!">Finalizată</option>
                    <option value="Comanda anulata">Anulată</option>
                    <option value="Refund">Refund</option>
                  </select>
                  <Button
                    onClick={() => handleFulfillOrder(order.id)}
                    className="w-full"
                  >
                    {order.orderStatus === "Comanda finalizata!"
                      ? "Unfulfill"
                      : "Fulfill"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteOrderId(order.id)}
                    className="w-full"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AlertDialog
        open={bulkActionDialogOpen}
        onOpenChange={setBulkActionDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare acțiune în bulk</AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction === "delete" &&
                "Sigur doriți să ștergeți comenzile selectate?"}
              {bulkAction === "fulfill" &&
                "Sigur doriți să marcați comenzile selectate ca îndeplinite?"}
              {bulkAction === "cancel" &&
                "Sigur doriți să anulați comenzile selectate?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBulkAction(null)}>
              Anulează
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkAction}>
              Confirmă
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteOrderId}
        onOpenChange={() => setDeleteOrderId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ești sigur că vrei să ștergi această comandă?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune este ireversibilă. Comanda va fi ștearsă definitiv
              din sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteOrderId && handleDeleteOrder(deleteOrderId)}
            >
              Șterge Comanda
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
