"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type OrderItem = {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  image: string;
};

type BundleOrderItem = {
  id: string;
  bundleId: string;
  quantity: number;
  price: number;
  bundle: {
    name: string;
    images: string[];
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

type DiscountCode = {
  code: string;
  type: string;
  value: number;
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentType: string;
  orderType?: string;
  items: OrderItem[];
  bundleOrders: BundleOrderItem[];
  details: OrderDetails;
  courier?: string;
  awb?: string;
  discountCodes: DiscountCode[];
};

const ProductCard = ({ item }: { item: OrderItem }) => (
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
      <p className="text-sm text-gray-500">Size: {item.size}</p>
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

const BundleCard = ({ bundleOrder }: { bundleOrder: BundleOrderItem }) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
    <Image
      src={bundleOrder.bundle.images[0] || "/placeholder.svg"}
      alt={bundleOrder.bundle.name}
      width={60}
      height={60}
      className="rounded-md object-cover"
    />
    <div className="flex-1">
      <h4 className="font-medium">{bundleOrder.bundle.name}</h4>
      <p className="text-sm text-gray-500">Quantity: {bundleOrder.quantity}</p>
    </div>
    <div className="text-right">
      <p className="font-medium">{bundleOrder.price.toFixed(2)} RON</p>
      <p className="text-sm text-gray-500">
        Total: {(bundleOrder.price * bundleOrder.quantity).toFixed(2)} RON
      </p>
    </div>
  </div>
);

export default function OrdersContent({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/orders?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">Loading orders...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="mb-8">{error}</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="text-left space-y-2 mb-12 font-poppins relative pb-6">
          <p className="text-sm uppercase tracking-wider text-black font-medium">
            YOUR SHOPPING HISTORY
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">My Orders</h2>
          <div className="absolute -bottom-[0.2rem] left-0 w-40 h-1 bg-[#FFD66C]"></div>
        </div>
        <p className="mb-8">You have no placed orders.</p>
        <Link href="/">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-left space-y-2 mb-12 font-poppins relative pb-6">
        <p className="text-sm uppercase tracking-wider text-black font-medium">
          YOUR SHOPPING HISTORY
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">My Orders</h2>
        <div className="absolute -bottom-[0.2rem] left-0 w-40 h-1 bg-[#FFD66C]"></div>
      </div>
      <div className="space-y-8">
        {orders.map((order) => (
          <Accordion type="single" collapsible key={order.id}>
            <AccordionItem value={order.id}>
              <AccordionTrigger>
                <div className="flex flex-col items-start space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">
                      Order {order.orderNumber}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: {order.total.toFixed(2)} RON
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Order Status</h3>
                    <p>Payment Status: {order.paymentStatus}</p>
                    <p>Order Status: {order.orderStatus}</p>
                    <p>
                      Payment Method:{" "}
                      {order.paymentType === "card"
                        ? "Card"
                        : "Ramburs la curier"}
                    </p>
                    {order.courier && <p>Courier: {order.courier}</p>}
                    {order.awb && <p>AWB: {order.awb}</p>}
                  </div>
                  <div>
                    <h3 className="font-semibold">Delivery Details</h3>
                    <p>{order.details.fullName}</p>
                    <p>{order.details.email}</p>
                    <p>{order.details.phoneNumber}</p>
                    <p>{order.details.street}</p>
                    <p>
                      {order.details.city}, {order.details.county}{" "}
                      {order.details.postalCode}
                    </p>
                    <p>{order.details.country}</p>
                    {order.details.notes && <p>Notes: {order.details.notes}</p>}
                  </div>
                  {order.discountCodes && order.discountCodes.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Applied Discounts</h3>
                      {order.discountCodes.map((discount) => (
                        <p key={discount.code}>
                          {discount.code}:{" "}
                          {discount.type === "free_shipping"
                            ? "Free Shipping"
                            : discount.type === "percentage"
                            ? `${discount.value}% off`
                            : `$${discount.value.toFixed(2)} off`}
                        </p>
                      ))}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <ProductCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>

                  {order.bundleOrders && order.bundleOrders.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Bundle Items</h3>
                      <div className="space-y-4">
                        {order.bundleOrders.map((bundleOrder) => (
                          <BundleCard
                            key={bundleOrder.id}
                            bundleOrder={bundleOrder}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-semibold">Detalii Client</h3>
                    <p>{order.details.fullName}</p>
                    <p>{order.details.email}</p>
                    <p>{order.details.phoneNumber}</p>
                    <p>{order.details.street}</p>
                    <p>
                      {order.details.city}, {order.details.county}{" "}
                      {order.details.postalCode}
                    </p>
                    <p>{order.details.country}</p>
                    {order.details.notes && <p>Note: {order.details.notes}</p>}

                    {order.details.isCompany && (
                      <div className="mt-4">
                        <h3 className="font-semibold">Detalii Factură</h3>
                        <p>Nume firmă: {order.details.companyName}</p>
                        <p>CUI: {order.details.companyCUI}</p>
                        <p>Reg. Com.: {order.details.companyRegNumber}</p>
                        <p>
                          Adresă: {order.details.companyAddress},{" "}
                          {order.details.companyCity},{" "}
                          {order.details.companyCounty}
                        </p>
                        <Button
                          onClick={() =>
                            window.open(
                              `/api/orders/${order.id}/invoice`,
                              "_blank"
                            )
                          }
                          className="mt-4"
                        >
                          Descarcă Factura
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
