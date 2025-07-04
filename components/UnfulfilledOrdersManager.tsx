"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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

// Tipuri de date
type ProductNeed = {
  productId: string;
  productName: string;
  color: string;
  quantity: number;
  image: string;
  stock: number;
  colorStock: number | null;
};

type OrderProduct = {
  id: string;
  productId: string;
  productName: string;
  color: string;
  quantity: number;
  image: string;
  inStock: boolean;
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: Date;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  orderStatus: string;
  total: number;
  products: OrderProduct[];
  allProductsInStock: boolean;
  courier: string | null;
  awb: string | null;
  details?: {
    isCompany: boolean;
    companyName: string;
    companyCUI: string;
    companyRegNumber: string;
    companyAddress: string;
    companyCity: string;
    companyCounty: string;
  };
};

export default function UnfulfilledOrdersManager() {
  // State-uri
  const [productNeeds, setProductNeeds] = useState<ProductNeed[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedProducts, setCheckedProducts] = useState<
    Record<string, boolean>
  >({});
  const [orderBeingProcessed, setOrderBeingProcessed] = useState<string | null>(
    null
  );
  const [courierDetails, setCourierDetails] = useState<{
    courier: string;
    awb: string;
  }>({ courier: "", awb: "" });
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderStatuses, setOrderStatuses] = useState<string[]>([]);
  // State pentru a ține evidența check-box-urilor per comandă
  const [checkedProductsPerOrder, setCheckedProductsPerOrder] = useState<
    Record<string, Record<string, boolean>>
  >({});

  // Încarcă datele la inițializare
  useEffect(() => {
    fetchUnfulfilledData();
  }, []);

  // Funcție pentru a încărca datele despre comenzile nelivrate
  const fetchUnfulfilledData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/moderator/unfulfilled-products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProductNeeds(data.productNeeds);
      setOrders(data.orders);

      // Colectează toate statusurile unice pentru debugging
      const statuses = Array.from(
        new Set(data.orders.map((order: Order) => order.orderStatus))
      );
      console.log("Statusuri de comenzi disponibile:", statuses);
      setOrderStatuses(statuses as string[]);

      // Inițializează state-ul pentru produsele bifate - pentru fiecare comandă separat
      const initialCheckedState: Record<string, Record<string, boolean>> = {};
      data.orders.forEach((order: Order) => {
        initialCheckedState[order.id] = {};
        order.products.forEach((product: OrderProduct) => {
          initialCheckedState[order.id][product.id] = false;
        });
      });
      setCheckedProductsPerOrder(initialCheckedState);
    } catch (error) {
      console.error("Error fetching unfulfilled data:", error);
      toast({
        title: "Eroare",
        description:
          "Nu s-au putut încărca datele. Încercați din nou mai târziu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funcție pentru a bifa/debifa un produs
  const handleProductCheck = (
    orderId: string,
    productId: string,
    checked: boolean
  ) => {
    setCheckedProductsPerOrder((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [productId]: checked,
      },
    }));
  };

  // Verifică dacă toate produsele dintr-o comandă sunt bifate
  const areAllProductsChecked = (orderId: string) => {
    const orderProducts =
      orders.find((order) => order.id === orderId)?.products || [];
    const orderCheckedProducts = checkedProductsPerOrder[orderId] || {};

    return orderProducts.every((product) => orderCheckedProducts[product.id]);
  };

  // Deschide dialogul pentru adăugarea detaliilor de livrare
  const openShippingDialog = (order: Order) => {
    setCurrentOrder(order);
    setCourierDetails({
      courier: order.courier || "",
      awb: order.awb || "",
    });
    setShowShippingDialog(true);
  };

  // Funcție pentru a trimite comanda către client
  const handleShipOrder = async () => {
    if (!currentOrder) return;

    try {
      setOrderBeingProcessed(currentOrder.id);

      // Adăugăm console.log pentru debugging
      console.log(
        `Trimitem comanda ${currentOrder.id} cu statusul actual ${currentOrder.orderStatus}`
      );
      console.log(
        `Detalii curier: ${courierDetails.courier}, AWB: ${courierDetails.awb}`
      );

      const response = await fetch(
        `/api/moderator/orders/${currentOrder.id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courier: courierDetails.courier,
            awb: courierDetails.awb,
            action: "ship",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating order: ${response.status}`);
      }

      const result = await response.json();
      console.log("Rezultat actualizare comandă:", result);

      // Reîncărcăm datele complete pentru a reflecta schimbările de pe server
      // Alternativ, putem actualiza doar comanda specifică
      await fetchUnfulfilledData();

      toast({
        title: "Succes",
        description:
          "Detaliile de livrare au fost adăugate cu succes. Comanda a fost marcată în curs de livrare.",
      });

      setShowShippingDialog(false);
    } catch (error) {
      console.error("Error shipping order:", error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza comanda. Încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setOrderBeingProcessed(null);
    }
  };

  // Funcție pentru a marca comanda ca finalizată
  const handleCompleteOrder = async (orderId: string) => {
    try {
      setOrderBeingProcessed(orderId);

      // Adăugăm console.log pentru debugging
      console.log(`Finalizăm comanda ${orderId}`);

      const response = await fetch(`/api/moderator/orders/${orderId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "complete",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error completing order: ${response.status}`);
      }

      const result = await response.json();
      console.log("Rezultat finalizare comandă:", result);

      // Reîncărcăm datele complete pentru a reflecta schimbările de pe server
      await fetchUnfulfilledData();

      toast({
        title: "Succes",
        description: "Comanda a fost marcată ca finalizată.",
      });
    } catch (error) {
      console.error("Error completing order:", error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut finaliza comanda. Încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setOrderBeingProcessed(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">Se încarcă...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Secțiunea de produse necesare */}
      <Card>
        <CardHeader>
          <CardTitle>Produse necesare pentru comenzile nelivrate</CardTitle>
          <CardDescription>
            Lista de produse necesare pentru a completa toate comenzile în
            așteptare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orderStatuses.length > 0 && (
              <div className="bg-amber-50 p-4 rounded mb-4 text-sm">
                <strong>Statusuri de comenzi disponibile:</strong>{" "}
                {orderStatuses.join(", ")}
              </div>
            )}

            {productNeeds.length === 0 ? (
              <p className="text-muted-foreground">
                Nu există produse necesare pentru comenzile în așteptare.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {productNeeds.map((product) => (
                  <Card
                    key={`${product.productId}_${product.color}`}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center p-4">
                      <div className="relative h-14 w-14 rounded-md overflow-hidden mr-4">
                        <Image
                          src={product.image}
                          alt={product.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {product.productName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Color: {product.color}
                        </p>
                        <div className="mt-1 flex items-center">
                          <span className="text-sm font-semibold">
                            {product.quantity} buc. necesare
                          </span>
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100">
                            Stoc:{" "}
                            {product.colorStock !== null
                              ? product.colorStock
                              : product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Secțiunea de comenzi nelivrate */}
      <Card>
        <CardHeader>
          <CardTitle>Comenzi în așteptare</CardTitle>
          <CardDescription>
            Gestionează comenzile care necesită procesare și livrare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {orders.length === 0 ? (
              <p className="text-muted-foreground">
                Nu există comenzi în așteptare.
              </p>
            ) : (
              <div className="flex flex-col space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Order {order.orderNumber}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left">
                      <div>
                        <span className="font-medium">
                          {order.customer.name}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString(
                            "ro-RO"
                          )}{" "}
                          - {order.products.length} produse
                        </p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <span className="font-medium">
                          {order.total.toFixed(2)} RON
                        </span>
                        <p className="text-xs">{order.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pentru adăugarea detaliilor de livrare */}
      <AlertDialog
        open={showShippingDialog}
        onOpenChange={setShowShippingDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adaugă detalii de livrare</AlertDialogTitle>
            <AlertDialogDescription>
              Completați informațiile despre curier și AWB pentru această
              comandă.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="courier" className="text-sm">
                Curier
              </label>
              <Input
                id="courier"
                value={courierDetails.courier}
                onChange={(e) =>
                  setCourierDetails({
                    ...courierDetails,
                    courier: e.target.value,
                  })
                }
                placeholder="Ex: FanCourier, Sameday, etc."
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="awb" className="text-sm">
                AWB
              </label>
              <Input
                id="awb"
                value={courierDetails.awb}
                onChange={(e) =>
                  setCourierDetails({ ...courierDetails, awb: e.target.value })
                }
                placeholder="Introduceți numărul AWB"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleShipOrder();
              }}
              disabled={
                !courierDetails.courier ||
                !courierDetails.awb ||
                orderBeingProcessed !== null
              }
            >
              {orderBeingProcessed ? "Se procesează..." : "Trimite comanda"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
