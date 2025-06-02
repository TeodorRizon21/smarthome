"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { COLLECTIONS } from "@/lib/collections";

export default function CollectionsNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b hidden">
      <div className="container mx-auto px-6">
        <ul className="flex items-center justify-center space-x-8 overflow-x-auto py-4">
          {Object.values(COLLECTIONS).map((collection) => (
            <li key={collection}>
              <Link
                href={`/collection/${encodeURIComponent(collection)}`}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition-colors hover:text-primary",
                  pathname === `/collection/${encodeURIComponent(collection)}`
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {collection}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
