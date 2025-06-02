"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Package, DollarSign, ShoppingBag, Layers } from "lucide-react";

type OrderStats = {
  orderCount: number;
  totalProducts: number;
  totalIndividualProducts: number;
  totalBundleProducts: number;
  totalAmount: number;
};

export default function ModeratorStats() {
  const [stats, setStats] = useState<OrderStats>({
    orderCount: 0,
    totalProducts: 0,
    totalIndividualProducts: 0,
    totalBundleProducts: 0,
    totalAmount: 0,
  });
  const [timeRange, setTimeRange] = useState<string>("unfulfilled");
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/moderator/order-stats?timeRange=${timeRange}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      toast({
        title: "Eroare",
        description:
          "Nu s-au putut încărca statisticile. Încercați din nou mai târziu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: "unfulfilled", label: "Comenzi nelivrate" },
    { value: "hour", label: "Ultima oră" },
    { value: "12hours", label: "Ultimele 12 ore" },
    { value: "day", label: "Ultima zi" },
    { value: "2days", label: "Ultimele 2 zile" },
    { value: "week", label: "Ultima săptămână" },
    { value: "month", label: "Ultima lună" },
    { value: "2months", label: "Ultimele 2 luni" },
    { value: "6months", label: "Ultimele 6 luni" },
    { value: "year", label: "Ultimul an" },
    { value: "all", label: "Tot timpul" },
  ];

  // Funcție pentru formatarea numerelor în format RON
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Statistici Comenzi</h2>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showDetails ? "Ascunde detalii" : "Arată detalii"}
          </button>
        </div>
        <div className="w-64">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtru perioadă" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Card #1: Număr Comenzi */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Comenzi
                </p>
                <div className="mt-2">
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : stats.orderCount}
                  </p>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card #2: Număr Produse */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Produse
                </p>
                <div className="mt-2">
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : stats.totalProducts}
                  </p>
                  {showDetails && !isLoading && (
                    <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                      <p>
                        Produse individuale: {stats.totalIndividualProducts}
                      </p>
                      <p>Produse din pachet: {stats.totalBundleProducts}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card #3: Venituri */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Venituri Totale
                </p>
                <div className="mt-2">
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : formatCurrency(stats.totalAmount)}
                  </p>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
