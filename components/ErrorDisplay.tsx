"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorDisplay({ message }: { message: string }) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Eroare la procesarea comenzii</h1>
      <p className="mb-8">
        A apărut o eroare la procesarea comenzii dumneavoastră. Vă rugăm să
        contactați serviciul clienți.
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Detalii eroare: {message || "Eroare necunoscută"}
      </p>
      <div className="mt-8">
        <Button onClick={() => router.push("/")}>
          Înapoi la pagina principală
        </Button>
      </div>
    </div>
  );
}
