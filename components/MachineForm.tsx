import {
  OPERATION_LABEL,
  MACHINE_STATUS_LABEL,
  MACHINE_CATEGORY_LABEL,
  CONDITION_LABEL,
  parseImages,
} from "@/lib/format";
import type { Machine } from "@prisma/client";

const inputClass =
  "mt-1 w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none";
const labelClass = "text-sm font-medium text-brand-gray-700";

export function MachineForm({
  action,
  machine,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  machine?: Machine;
  submitLabel: string;
}) {
  const images = machine ? parseImages(machine.images).join(", ") : "";

  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Título</label>
          <input name="title" required defaultValue={machine?.title} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Marca</label>
          <input name="brand" defaultValue={machine?.brand ?? "LiuGong"} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Modelo</label>
          <input name="model" required defaultValue={machine?.model} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Categoría</label>
          <select name="category" defaultValue={machine?.category ?? "RETROPALA"} className={inputClass}>
            {Object.entries(MACHINE_CATEGORY_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Operación</label>
          <select name="operation" defaultValue={machine?.operation ?? "VENTA"} className={inputClass}>
            {Object.entries(OPERATION_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Condición</label>
          <select name="condition" defaultValue={machine?.condition ?? "NUEVA"} className={inputClass}>
            {Object.entries(CONDITION_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select name="status" defaultValue={machine?.status ?? "DISPONIBLE"} className={inputClass}>
            {Object.entries(MACHINE_STATUS_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Año</label>
          <input name="year" type="number" defaultValue={machine?.year ?? undefined} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Horas de uso</label>
          <input name="hours" type="number" defaultValue={machine?.hours ?? undefined} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Precio</label>
          <input name="price" type="number" required defaultValue={machine?.price} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Moneda</label>
          <input name="currency" defaultValue={machine?.currency ?? "USD"} className={inputClass} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={machine?.featured}
            className="h-4 w-4 rounded border-brand-gray-300 text-brand-orange focus:ring-brand-orange"
          />
          <label htmlFor="featured" className="text-sm text-brand-gray-700">
            Destacar en la home
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={machine?.description}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Imágenes (URLs separadas por coma)</label>
        <input name="images" defaultValue={images} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>URL de panorama 360° (opcional)</label>
        <input
          name="panoramaUrl"
          defaultValue={machine?.panoramaUrl ?? ""}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}
