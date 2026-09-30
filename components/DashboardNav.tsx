"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  Truck,
  Wrench,
  Receipt,
  UserCog,
  FileDown,
} from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads / Embudo", icon: Users },
  { href: "/dashboard/maquinas", label: "Máquinas", icon: Truck },
  { href: "/dashboard/repuestos", label: "Repuestos", icon: Wrench },
  { href: "/dashboard/ventas", label: "Ventas", icon: Receipt },
  { href: "/dashboard/vendedores", label: "Vendedores", icon: UserCog },
  { href: "/dashboard/reportes", label: "Reportes", icon: FileDown },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-brand-orange text-white"
                : "text-brand-gray-300 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon size={17} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
