import { redirect } from "next/navigation";
import { canAccessModeration } from "@/lib/auth";
import ModeratorStats from "@/components/ModeratorStats";
import UnfulfilledOrdersManager from "@/components/UnfulfilledOrdersManager";

export default async function ModeratorPage() {
  const hasAccess = await canAccessModeration();

  if (!hasAccess) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Panoul Moderatorului
        </h1>
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
