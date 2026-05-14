"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, LogOut, Layers, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/team", label: "Team", icon: Users },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-lg flex items-center justify-center mr-3 shadow-lg">
          <Layers className="text-white w-5 h-5" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">TeamTasker</span>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 hover:text-white text-slate-300"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 shrink-0">
        <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname.startsWith('/settings') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white text-slate-300'}`}>
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </div>
        </Link>
        <div
          onClick={() => {
            setIsMobileMenuOpen(false);
            handleLogout();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-400 hover:bg-slate-800 cursor-pointer mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-slate-900 border-r-slate-800 w-64 flex flex-col">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h2 className="text-xl font-semibold text-slate-800 capitalize hidden sm:block">
              {pathname.split("/")[1] || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
