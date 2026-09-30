import { MachineForm } from "@/components/MachineForm";
import { createMachine } from "@/lib/actions/machines";

export default function NuevaMaquinaPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-gray-900">Nueva máquina</h1>
      <p className="mt-1 text-sm text-brand-gray-500">
        Se publica al instante en el sitio público.
      </p>
      <div className="mt-6 rounded-xl border border-brand-gray-200 bg-white p-6 shadow-sm">
        <MachineForm action={createMachine} submitLabel="Publicar máquina" />
      </div>
    </div>
  );
}
