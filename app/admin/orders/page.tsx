import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrderList from "@/components/AdminOrderList";

export default async function AdminOrdersPage() {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/admin">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-8">Admin: Order Tracking</h1>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="products">Comenzi Produse</TabsTrigger>
          <TabsTrigger value="bundles">Comenzi Bundle-uri</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <AdminOrderList orderType="product" />
        </TabsContent>
        <TabsContent value="bundles">
          <AdminOrderList orderType="bundle" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
