import Link from "next/link";
import Image from "next/image";
import { Plus, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { MachineStatusSelect } from "@/components/MachineStatusSelect";
import {
  formatCurrency,
  OPERATION_LABEL,
  MACHINE_CATEGORY_LABEL,
} from "@/lib/format";

export default async function DashboardMaquinasPage() {
  const machines = await prisma.machine.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Máquinas en stock</h1>
          <p className="mt-1 text-sm text-brand-gray-500">
            Lo que cargues acá se refleja al instante en el sitio público.
          </p>
        </div>
        <Link
          href="/dashboard/maquinas/nueva"
          className="flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          <Plus size={16} /> Nueva máquina
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-gray-50 text-xs uppercase text-brand-gray-500">
            <tr>
              <th className="px-4 py-3">Máquina</th>
              <th className="px-4 py-3">Operación</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-100">
            {machines.map((m) => (
              <tr key={m.id}>
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-brand-gray-100">
                    {m.coverImage ? (
                      <Image src={m.coverImage} alt="" fill sizes="56px" className="object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/maquinas/${m.id}`}
                      className="font-medium text-brand-gray-900 visited:text-brand-gray-900 hover:text-brand-orange"
                    >
                      {m.title}
                    </Link>
                    <p className="text-xs text-brand-gray-500">
                      {m.brand} {m.model}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">{OPERATION_LABEL[m.operation]}</td>
                <td className="px-4 py-3">{MACHINE_CATEGORY_LABEL[m.category]}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(m.price, m.currency)}</td>
                <td className="px-4 py-3">
                  <MachineStatusSelect id={m.id} status={m.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/maquinas/${m.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs text-brand-gray-500 hover:text-brand-orange"
                  >
                    Ver en sitio <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
            {machines.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-gray-500">
                  Todavía no hay máquinas cargadas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
