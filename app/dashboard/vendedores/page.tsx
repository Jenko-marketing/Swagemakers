import { prisma } from "@/lib/db";
import { createVendor } from "@/lib/actions/vendors";
import { formatCurrency } from "@/lib/format";

export default async function VendedoresPage() {
  const vendors = await prisma.salesperson.findMany({
    include: {
      machineSales: true,
      leads: { where: { stage: { notIn: ["GANADO", "PERDIDO"] } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Vendedores</h1>
          <p className="mt-1 text-sm text-brand-gray-500">
            Equipo comercial y resumen de ventas por vendedor.
          </p>
        </div>
        <form action={createVendor} className="flex flex-wrap gap-2">
          <input name="name" placeholder="Nombre" required className="w-40 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
          <input name="phone" placeholder="Teléfono" className="w-40 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-lg bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark">
            + Vendedor
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => {
          const total = v.machineSales.reduce((acc, s) => acc + s.amount, 0);
          return (
            <div key={v.id} className="rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-brand-gray-900">{v.name}</p>
              <p className="text-xs text-brand-gray-500">{v.phone ?? v.email ?? "Sin contacto"}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-2xl font-bold text-brand-navy">{v.machineSales.length}</p>
                  <p className="text-xs text-brand-gray-500">Máquinas vendidas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-navy">{v.leads.length}</p>
                  <p className="text-xs text-brand-gray-500">Leads activos</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-brand-orange-dark">
                {formatCurrency(total)} vendidos
              </p>
            </div>
          );
        })}
        {vendors.length === 0 ? (
          <p className="text-brand-gray-500">Todavía no hay vendedores cargados.</p>
        ) : null}
      </div>
    </div>
  );
}
