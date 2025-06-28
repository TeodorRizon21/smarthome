"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Statistics = {
  timeline: Array<{
    timestamp: string;
    revenue: number;
  }>;
  products: Array<{
    id: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
    category: string;
  }>;
  repeatCustomers: Array<{
    email: string;
    orderCount: number;
    totalSpent: number;
    orders: Array<{
      id: string;
      createdAt: Date;
      total: number;
      status: string;
    }>;
  }>;
  counties: Array<{
    name: string;
    orderCount: number;
    totalRevenue: number;
  }>;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalSales: number;
    averageOrderValue: number;
    details: {
      productSales: number;
      bundleSales: number;
      productRevenue: number;
      bundleRevenue: number;
    };
  };
};

export default function StatisticsContent() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Statistics["repeatCustomers"][0] | null
  >(null);

  useEffect(() => {
    fetchStats();
  }, [timeRange, selectedCounty, selectedCategory, showCompletedOnly]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        timeRange,
        ...(selectedCounty !== "all" && { county: selectedCounty }),
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        showCompletedOnly: showCompletedOnly.toString(),
      });

      const response = await fetch(`/api/admin/statistics?${params}`);
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
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
    { value: "24h", label: "Ultimele 24 ore" },
    { value: "7d", label: "Ultimele 7 zile" },
    { value: "60d", label: "Ultimele 60 zile" },
    { value: "1y", label: "Ultimul an" },
    { value: "all", label: "Tot timpul" },
  ];

  const categories = stats?.products
    ? Array.from(new Set(stats.products.map((p) => p.category)))
    : [];

  const counties = stats?.counties.map((c) => c.name) || [];

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    switch (timeRange) {
      case "24h":
        return date.toLocaleTimeString("ro-RO", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "7d":
        return date.toLocaleDateString("ro-RO", { weekday: "short" });
      case "60d":
        return `Săpt. ${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
      case "1y":
        return date.toLocaleDateString("ro-RO", { month: "short" });
      case "all":
        return date.getFullYear().toString();
      default:
        return date.toLocaleTimeString("ro-RO", {
          hour: "2-digit",
          minute: "2-digit",
        });
    }
  };

  const formatTooltip = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label>Perioadă</Label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue />
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

        <div>
          <Label>Județ</Label>
          <Select value={selectedCounty} onValueChange={setSelectedCounty}>
            <SelectTrigger>
              <SelectValue placeholder="Toate județele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate județele</SelectItem>
              {counties.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Categorie</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Toate categoriile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate categoriile</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="completedOnly"
            checked={showCompletedOnly}
            onCheckedChange={(checked) =>
              setShowCompletedOnly(checked as boolean)
            }
          />
          <Label htmlFor="completedOnly">Doar comenzi finalizate</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Comenzi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats?.summary.totalOrders || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Vânzări</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats?.summary.totalSales || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Venituri</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading
                ? "..."
                : formatCurrency(stats?.summary.totalRevenue || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evoluție Venituri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.timeline || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  interval="preserveStartEnd"
                  axisLine={false}
                  tickLine={false}
                  stroke="#b0b7c3"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tickFormatter={formatTooltip}
                  axisLine={false}
                  tickLine={false}
                  stroke="#b0b7c3"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString("ro-RO")
                  }
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Venit",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#a259ff"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Produse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.products
              .sort((a, b) => b.totalSales - a.totalSales)
              .slice(0, 5)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.totalSales} bucăți</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Județe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.counties
              .sort((a, b) => b.orderCount - a.orderCount)
              .slice(0, 5)
              .map((county) => (
                <div
                  key={county.name}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{county.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{county.orderCount} comenzi</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(county.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clienți Recurenți</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.repeatCustomers.map((customer) => (
              <div
                key={customer.email}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{customer.email}</p>
                  <p className="text-sm text-gray-500">
                    {customer.orderCount} comenzi
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">
                    {formatCurrency(customer.totalSpent)}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        Vezi Comenzi
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Comenzile clientului {customer.email}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {customer.orders.map((order) => (
                          <div
                            key={order.id}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "ro-RO"
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                Status: {order.status}
                              </p>
                            </div>
                            <p className="font-medium">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
