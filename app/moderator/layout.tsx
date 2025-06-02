import { redirect } from "next/navigation";
import { canAccessModeration } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Flag,
  ShieldAlert,
  MessageSquare,
  LogOut,
} from "lucide-react";
import MobileMenuButton from "@/components/MobileMenuButton";

export default async function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await canAccessModeration();

  if (!hasAccess) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary">Moderator Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/moderator"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/moderator/reports"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Flag className="h-5 w-5" />
              <span>Rapoarte</span>
            </Link>

            <Link
              href="/moderator/comments"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Comentarii</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Înapoi la Site</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <MobileMenuButton />

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-end">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Bun venit, Moderator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
