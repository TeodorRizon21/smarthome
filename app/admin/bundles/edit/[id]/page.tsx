import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import EditBundleForm from "@/components/EditBundleForm";
import { prisma } from "@/lib/prisma";

interface EditBundlePageProps {
  params: {
    id: string;
  };
}

export default async function EditBundlePage({ params }: EditBundlePageProps) {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect("/");
  }

  const bundleId = params.id;

  // Obținem datele bundle-ului pentru a le afișa în formular
  const bundle = await prisma.bundle.findUnique({
    where: {
      id: bundleId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!bundle) {
    redirect("/admin/bundles");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editare Bundle</h1>
        <p className="text-gray-500">
          Actualizează detaliile pentru bundle-ul {bundle.name}
        </p>
      </div>

      <EditBundleForm bundle={bundle} />
    </div>
  );
}
