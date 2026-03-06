"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

export default function Newsletter() {
  const { t } = useLanguage();
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
        title: t("newsletter.success"),
        description: t("newsletter.successDesc"),
      });
      setEmail("");
    } catch (error) {
      toast({
        title: t("newsletter.error"),
        description: t("newsletter.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen relative left-[50%] right-[50%] -mx-[50vw]">
      <div className="bg-[#29b4b9] py-16 rounded-tl-[100px] rounded-tr-[100px]">
        <div className="max-w-[1250px] mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left max-w-sm">
              <p className="text-sm mb-2">{t("newsletter.lead")}</p>
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                {t("newsletter.title")}
              </h2>
              <p className="text-gray-700 text-sm">
                {t("newsletter.description")}
              </p>
            </div>

            <div className="w-full md:w-auto flex items-center px-4 md:px-0">
              <div className="w-full md:w-[500px] bg-white rounded-full py-4 px-4 md:px-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter.placeholder")}
                    className="flex-1 min-w-0 border-none shadow-none focus:ring-0 bg-transparent h-12 rounded-3xl px-4 md:px-4"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-800 rounded-full px-8 h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? t("newsletter.buttonLoading") : t("newsletter.button")}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
