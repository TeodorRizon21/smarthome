import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import NewBundleForm from "@/components/NewBundleForm";

export default async function NewBundlePage() {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Adaugă Bundle Nou</h1>
        <p className="text-gray-500">
          Creează un nou pachet de produse smart home
        </p>
      </div>

      <NewBundleForm />
    </div>
  );
}
