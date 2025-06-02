"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      toast({
        title: "Succes!",
        description: "Te-ai abonat cu succes la newsletter!",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Eroare",
        description:
          "A apărut o eroare la abonare. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FFD66C] py-16 rounded-tl-[100px] rounded-tr-[100px]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-evenly gap-4">
          {/* Text section */}
          <div className="text-left max-w-sm">
            <p className="text-sm mb-2">Fii la curent cu SmartHomeMall</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              Abonează-te la Newsletter!
            </h2>
            <p className="text-gray-700 text-sm">
              Fii mereu la curent cu ultimele promoții și produse SmartHomeMall!
              Nu te vom deranja prea des, îți vom scrie doar când e ceva care ți
              se potrivește!
            </p>
          </div>

          {/* Form section */}
          <div className="w-full md:w-auto flex items-center">
            <div className="w-full md:w-[500px] bg-white rounded-full py-4 px-4">
              <form onSubmit={handleSubmit} className="flex">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="flex-1 border-none shadow-none focus:ring-0 bg-transparent h-12 rounded-3xl"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 rounded-full px-8 h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "SE PROCESEAZĂ..." : "ABONEAZĂ-TE"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
