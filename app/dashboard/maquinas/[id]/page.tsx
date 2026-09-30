import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { MachineForm } from "@/components/MachineForm";
import { updateMachine, deleteMachine } from "@/lib/actions/machines";

export default async function EditarMaquinaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const machine = await prisma.machine.findUnique({ where: { id } });
  if (!machine) notFound();

  const boundUpdate = updateMachine.bind(null, machine.id);
  const boundDelete = deleteMachine.bind(null, machine.id);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Editar máquina</h1>
          <p className="mt-1 text-sm text-brand-gray-500">{machine.title}</p>
        </div>
        <form action={boundDelete}>
          <button
            type="submit"
            className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
        </form>
      </div>
      <div className="mt-6 rounded-xl border border-brand-gray-200 bg-white p-6 shadow-sm">
        <MachineForm action={boundUpdate} machine={machine} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
