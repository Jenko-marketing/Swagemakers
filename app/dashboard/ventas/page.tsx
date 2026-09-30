import { prisma } from "@/lib/db";
import { registerMachineSale } from "@/lib/actions/sales";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function VentasPage() {
  const [machinesDisponibles, vendors, machineSales, partSales] = await Promise.all([
    prisma.machine.findMany({ where: { status: "DISPONIBLE" }, orderBy: { title: "asc" } }),
    prisma.salesperson.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.machineSale.findMany({
      include: { machine: true, vendor: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
    prisma.partSale.findMany({
      include: { part: true, vendor: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-gray-900">Ventas</h1>
      <p className="mt-1 text-sm text-brand-gray-500">
        Registro de ventas de máquinas y de repuestos.
      </p>

      <div className="mt-6 rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-brand-gray-900">Registrar venta de máquina</h2>
        <form action={registerMachineSale} className="mt-3 flex flex-wrap gap-2">
          <select name="machineId" required className="w-56 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm">
            <option value="">Elegí una máquina...</option>
            {machinesDisponibles.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({formatCurrency(m.price, m.currency)})
              </option>
            ))}
          </select>
          <input name="buyerName" placeholder="Comprador" required className="w-44 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
          <input name="amount" type="number" placeholder="Monto final" required className="w-36 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
          <select name="vendorId" className="w-40 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm">
            <option value="">Vendedor...</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark">
            Registrar venta
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm">
          <div className="border-b border-brand-gray-100 bg-brand-gray-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-brand-gray-700">Máquinas vendidas</h2>
          </div>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-brand-gray-100">
              {machineSales.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-gray-900">{s.machine.title}</p>
                    <p className="text-xs text-brand-gray-500">
                      {s.buyerName} · {s.vendor?.name ?? "Sin vendedor"} · {formatDate(s.date)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(s.amount, s.currency)}
                  </td>
                </tr>
              ))}
              {machineSales.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-brand-gray-500">
                    Todavía no hay ventas registradas.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm">
          <div className="border-b border-brand-gray-100 bg-brand-gray-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-brand-gray-700">Repuestos vendidos</h2>
          </div>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-brand-gray-100">
              {partSales.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-gray-900">
                      {s.quantity}x {s.part.name}
                    </p>
                    <p className="text-xs text-brand-gray-500">
                      {s.customerName} · {s.vendor?.name ?? "Sin vendedor"} · {formatDate(s.date)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(s.total, s.part.currency)}
                  </td>
                </tr>
              ))}
              {partSales.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-brand-gray-500">
                    Todavía no hay ventas de repuestos.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
