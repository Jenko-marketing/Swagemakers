import { FileDown } from "lucide-react";
import { toDateInputValue } from "@/lib/format";

export default function ReportesPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-gray-900">Reportes</h1>
      <p className="mt-1 max-w-xl text-sm text-brand-gray-500">
        Elegí un rango de fechas y descargá en un click el registro completo de ventas
        de máquinas, ventas de repuestos y leads generados en ese período, para
        auditoría.
      </p>

      <form
        action="/api/reportes/export"
        method="GET"
        className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label className="text-sm font-medium text-brand-gray-700">Desde</label>
          <input
            type="date"
            name="from"
            defaultValue={toDateInputValue(startOfMonth)}
            className="mt-1 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-brand-gray-700">Hasta</label>
          <input
            type="date"
            name="to"
            defaultValue={toDateInputValue(now)}
            className="mt-1 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          <FileDown size={16} /> Descargar CSV
        </button>
      </form>

      <p className="mt-4 text-xs text-brand-gray-500">
        El archivo incluye tres secciones: ventas de máquinas, ventas de repuestos y
        leads generados en el rango elegido, con totales.
      </p>
    </div>
  );
}
