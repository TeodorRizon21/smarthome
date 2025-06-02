"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function NewsletterManagementPanel() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/admin/newsletter/subscribers");
      if (!response.ok) throw new Error("Failed to fetch subscribers");
      const data = await response.json();
      setSubscribers(data);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca abonații.",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubscribers(subscribers.map((s) => s.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedSubscribers([...selectedSubscribers, id]);
    } else {
      setSelectedSubscribers(selectedSubscribers.filter((s) => s !== id));
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubscribers.length === 0) {
      toast({
        title: "Eroare",
        description: "Te rugăm să selectezi cel puțin un abonat.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriberIds: selectedSubscribers,
          subject: emailSubject,
          content: emailContent,
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      toast({
        title: "Succes",
        description: "Email-ul a fost trimis cu succes.",
      });
      setEmailSubject("");
      setEmailContent("");
      setSelectedSubscribers([]);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut trimite email-ul.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleUnsubscribe = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/newsletter/unsubscribe/${id}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to unsubscribe");
      await fetchSubscribers();
      toast({
        title: "Succes",
        description: "Abonatul a fost dezabonat cu succes.",
      });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut dezabona utilizatorul.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Lista de abonați */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Abonați Newsletter</h2>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedSubscribers.length === subscribers.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all">Selectează toți</label>
          </div>
        </div>
        <div className="space-y-2">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={subscriber.id}
                  checked={selectedSubscribers.includes(subscriber.id)}
                  onCheckedChange={(checked) =>
                    handleSelectSubscriber(subscriber.id, checked as boolean)
                  }
                />
                <label htmlFor={subscriber.id}>{subscriber.email}</label>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUnsubscribe(subscriber.id)}
                >
                  Dezabonează
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formular trimitere email */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Trimite Email</h2>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subiect
            </label>
            <Input
              id="subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Conținut
            </label>
            <Textarea
              id="content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              required
              rows={6}
            />
          </div>
          <Button
            type="submit"
            disabled={isSending || selectedSubscribers.length === 0}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se trimite...
              </>
            ) : (
              "Trimite Email"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
