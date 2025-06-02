"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  useEffect(() => {
    if (!email) {
      toast({
        title: "Eroare",
        description: "Email-ul nu a fost găsit.",
        variant: "destructive",
      });
    }
  }, [email]);

  const handleUnsubscribe = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      console.log(`Încep procesul de dezabonare pentru: ${email}`);

      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unsubscribe");
      }

      console.log("Răspuns de la server:", data);

      setIsUnsubscribed(true);
      toast({
        title: "Succes",
        description: "Te-ai dezabonat cu succes de la newsletter.",
      });
    } catch (error) {
      console.error("Eroare la dezabonare:", error);
      toast({
        title: "Eroare",
        description:
          "Nu s-a putut procesa dezabonarea. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Link invalid</h1>
        <p>Link-ul de dezabonare este invalid sau a expirat.</p>
      </div>
    );
  }

  if (isUnsubscribed) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Te-ai dezabonat cu succes</h1>
        <p>Nu vei mai primi newsletter-ul nostru.</p>
        <p className="mt-4">
          Poți să te abonezi din nou oricând folosind formularul de pe site.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Confirmă dezabonarea</h1>
      <p className="mb-6">
        Ești sigur că vrei să te dezabonezi de la newsletter-ul SmartHomeMall?
      </p>
      <Button
        onClick={handleUnsubscribe}
        disabled={isLoading}
        variant="destructive"
      >
        {isLoading ? "Se procesează..." : "Da, vreau să mă dezabonez"}
      </Button>
    </div>
  );
}
