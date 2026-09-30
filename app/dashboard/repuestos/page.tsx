import { prisma } from "@/lib/db";
import { Badge } from "@/components/Badge";
import { createPart, registerPartSale } from "@/lib/actions/parts";
import { formatCurrency } from "@/lib/format";

export default async function RepuestosDashboardPage() {
  const [parts, vendors] = await Promise.all([
    prisma.sparePart.findMany({ orderBy: { name: "asc" } }),
    prisma.salesperson.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-gray-900">Repuestos</h1>
      <p className="mt-1 text-sm text-brand-gray-500">
        Inventario y registro de ventas de repuestos.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-brand-gray-900">Nuevo repuesto</h2>
          <form action={createPart} className="mt-3 space-y-2">
            <input name="code" placeholder="Código" required className="w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
            <input name="name" placeholder="Nombre" required className="w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
            <input name="category" placeholder="Categoría (ej: Filtros)" className="w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <input name="stock" type="number" placeholder="Stock" className="w-1/2 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
              <input name="price" type="number" placeholder="Precio" required className="w-1/2 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark">
              Agregar repuesto
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-brand-gray-900">Registrar venta</h2>
          <form action={registerPartSale} className="mt-3 space-y-2">
            <select name="partId" required className="w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm">
              <option value="">Elegí un repuesto...</option>
              {parts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatCurrency(p.price, p.currency)} (stock: {p.stock})
                </option>
              ))}
            </select>
            <input name="customerName" placeholder="Cliente" required className="w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <input name="quantity" type="number" min="1" defaultValue={1} className="w-1/2 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm" />
              <select name="vendorId" className="w-1/2 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm">
                <option value="">Vendedor...</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark">
              Registrar venta
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-gray-50 text-xs uppercase text-brand-gray-500">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Repuesto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-100">
            {parts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-mono text-xs text-brand-gray-500">{p.code}</td>
                <td className="px-4 py-3 font-medium text-brand-gray-900">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{formatCurrency(p.price, p.currency)}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.stock > 5 ? "green" : p.stock > 0 ? "amber" : "red"}>
                    {p.stock} u.
                  </Badge>
                </td>
              </tr>
            ))}
            {parts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-gray-500">
                  Todavía no hay repuestos cargados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
