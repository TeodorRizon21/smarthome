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
  productCode: string | null;
};

type OrderProduct = {
  id: string;
  productId: string;
  productName: string;
  color: string;
  quantity: number;
  image: string;
  productCode: string | null;
};

type OrderDetails = {
  id: string;
  userId?: string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  isCompany: boolean;
  companyName?: string;
  companyCUI?: string;
  companyRegNumber?: string;
  companyAddress?: string;
  companyCity?: string;
  companyCounty?: string;
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: Date;
  orderStatus: string;
  paymentStatus: string;
  paymentType: string;
  total: number;
  products: OrderProduct[];
  courier: string | null;
  awb: string | null;
  details: OrderDetails;
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
    <div className="space-y-8">
      {/* Secțiunea de produse necesare */}
      <Card>
        <CardHeader>
          <CardTitle>Produse necesare pentru comenzi nelivrate</CardTitle>
          <CardDescription>
            Lista tuturor produselor necesare pentru comenzile în așteptare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productNeeds.map((product) => (
              <div
                key={`${product.productId}_${product.color}`}
                className="flex items-center space-x-4"
              >
                <div className="relative h-16 w-16">
                  <Image
                    src={product.image}
                    alt={product.productName}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{product.productName}</h4>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100">
                      Cod produs: {product.productCode || "N/A"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Culoare: {product.color}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cantitate necesară: {product.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secțiunea de comenzi nelivrate */}
      <Card>
        <CardHeader>
          <CardTitle>Comenzi nelivrate</CardTitle>
          <CardDescription>
            Gestionează comenzile care așteaptă să fie livrate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
              <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Comanda #{order.orderNumber}
                      </h3>
                      <span className="text-sm text-gray-500 ml-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Detalii client */}
                    <div>
                      <span className="font-medium">
                        {order.details.fullName}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Email: {order.details.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Telefon: {order.details.phoneNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Adresă:{" "}
                        {`${order.details.street}, ${order.details.city}, ${order.details.county}, ${order.details.postalCode}`}
                      </p>
                      {order.details.isCompany && (
                        <>
                          <p className="text-xs text-muted-foreground mt-2">
                            Companie: {order.details.companyName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            CUI: {order.details.companyCUI}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Nr. Reg. Com.: {order.details.companyRegNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Adresă firmă:{" "}
                            {`${order.details.companyAddress}, ${order.details.companyCity}, ${order.details.companyCounty}`}
                          </p>
                        </>
                      )}
                    </div>

                    <Separator />

                    {/* Produse */}
                    <div className="space-y-4">
                      {order.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center space-x-4"
                        >
                          <Checkbox
                            id={`${order.id}_${product.id}`}
                            checked={
                              checkedProductsPerOrder[order.id]?.[product.id] ||
                              false
                            }
                            onCheckedChange={(checked) =>
                              handleProductCheck(
                                order.id,
                                product.id,
                                checked as boolean
                              )
                            }
                          />
                          <div className="relative h-16 w-16">
                            <Image
                              src={product.image}
                              alt={product.productName}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">
                                {product.productName}
                              </h4>
                              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100">
                                Cod produs: {product.productCode || "N/A"}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Culoare: {product.color}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Cantitate: {product.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Status și acțiuni */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          Status comandă: {order.orderStatus}
                        </p>
                        <p className="text-sm">
                          Status plată: {order.paymentStatus}
                        </p>
                        <p className="text-sm">
                          Metodă plată: {order.paymentType}
                        </p>
                        <p className="text-sm font-medium">
                          Total: {order.total.toFixed(2)} RON
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          onClick={() => openShippingDialog(order)}
                          disabled={!areAllProductsChecked(order.id)}
                        >
                          Adaugă AWB
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Dialog pentru detalii de livrare */}
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
