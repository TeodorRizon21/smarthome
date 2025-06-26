"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function SuccessContent({
  orderId,
  paymentType,
  orderNumber,
}: {
  orderId: string;
  paymentType: string;
  orderNumber?: string;
}) {
  const router = useRouter();
  const { dispatch } = useCart();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    dispatch({ type: "CLEAR_CART" });

    // Verifică dacă pagina a fost reîncărcată
    const pageAccessedByReload =
      (window.performance.navigation &&
        window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType("navigation")
        .map((nav) => (nav as any).type)
        .includes("reload");

    if (pageAccessedByReload) {
      setHasRefreshed(true);
    }
  }, [dispatch]);

  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Vă mulțumim pentru comandă!</h1>
      <p className="mb-4">
        Comanda dumneavoastră (Număr: {orderNumber || orderId}) a fost înregistrată cu succes.
      </p>
      <p className="mb-4">
        Metodă de plată: {paymentType === "card" ? "Card" : "Ramburs la curier"}
      </p>
      <p className="mb-4">
        Puteți vizualiza detaliile comenzii în secțiunea "Comenzile mele".
      </p>

      {hasRefreshed && (
        <Alert className="mb-4 mx-auto max-w-md bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          <AlertDescription>
            Ați reîncărcat pagina. Comanda a fost deja procesată, vă rugăm să nu
            reîncărcați această pagină pentru a evita confuziile.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-x-4">
        <Button onClick={() => router.push("/orders")}>
          Vezi Comenzile Mele
        </Button>
        <Button onClick={() => router.push("/")} variant="outline">
          Continuă Cumpărăturile
        </Button>
      </div>
    </div>
  );
}
