import Link from "next/link";
import { Users, Truck, DollarSign, Wrench, Bell } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default async function DashboardHome() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    leadsActivos,
    maquinasDisponibles,
    ventasMaquinasMes,
    ventasRepuestosMes,
    notifications,
  ] = await Promise.all([
    prisma.lead.count({ where: { stage: { notIn: ["GANADO", "PERDIDO"] } } }),
    prisma.machine.count({ where: { status: "DISPONIBLE" } }),
    prisma.machineSale.aggregate({
      where: { date: { gte: startOfMonth } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.partSale.aggregate({
      where: { date: { gte: startOfMonth } },
      _sum: { total: true, quantity: true },
    }),
    prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const cards = [
    {
      label: "Leads activos",
      value: leadsActivos,
      icon: Users,
      href: "/dashboard/leads",
    },
    {
      label: "Máquinas disponibles",
      value: maquinasDisponibles,
      icon: Truck,
      href: "/dashboard/maquinas",
    },
    {
      label: "Ventas del mes",
      value: formatCurrency(ventasMaquinasMes._sum.amount ?? 0),
      icon: DollarSign,
      href: "/dashboard/ventas",
    },
    {
      label: "Repuestos vendidos (mes)",
      value: ventasRepuestosMes._sum.quantity ?? 0,
      icon: Wrench,
      href: "/dashboard/repuestos",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-gray-900">Resumen</h1>
      <p className="mt-1 text-sm text-brand-gray-500">
        Estado general de leads, máquinas, ventas y repuestos.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
              <card.icon size={18} />
            </span>
            <p className="mt-4 text-3xl font-bold text-brand-gray-900">{card.value}</p>
            <p className="mt-1 text-sm text-brand-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Bell size={17} className="text-brand-orange" />
          <h2 className="font-semibold text-brand-gray-900">Notificaciones recientes</h2>
        </div>
        <div className="mt-4 divide-y divide-brand-gray-100">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-brand-gray-900">{n.title}</p>
                <p className="text-sm text-brand-gray-500">{n.body}</p>
              </div>
              <span className="shrink-0 text-xs text-brand-gray-400">
                {formatDateTime(n.createdAt)}
              </span>
            </div>
          ))}
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-brand-gray-500">
              Todavía no hay notificaciones. Probá el botón &quot;Simular lead de Meta
              Ads&quot; en Leads.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
