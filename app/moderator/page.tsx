import { redirect } from "next/navigation";
import { canAccessModeration } from "@/lib/auth";
import ModeratorStats from "@/components/ModeratorStats";
import UnfulfilledOrdersManager from "@/components/UnfulfilledOrdersManager";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function ModeratorPage() {
  const hasAccess = await canAccessModeration();

  if (!hasAccess) {
    redirect("/");
  }

  return (
    <div className="space-y-6 mt-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Panoul Moderatorului
          </h1>
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span>Înapoi la Site</span>
          </Link>
        </div>

        <p className="text-gray-500 mt-2">
          Bine ai venit în panoul de moderator! De aici poți gestiona conținutul
          site-ului.
        </p>
      </div>

      <ModeratorStats />

      <UnfulfilledOrdersManager />
    </div>
  );
}
