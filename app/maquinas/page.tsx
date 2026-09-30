import Link from "next/link";
import { clsx } from "clsx";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MachineCard } from "@/components/MachineCard";

const OPERATIONS = [
  { value: "", label: "Todas" },
  { value: "VENTA", label: "Venta" },
  { value: "ALQUILER", label: "Alquiler" },
];

export default async function MaquinasPage({
  searchParams,
}: {
  searchParams: Promise<{ operation?: string }>;
}) {
  const { operation } = await searchParams;

  const machines = await prisma.machine.findMany({
    where: {
      status: { in: ["DISPONIBLE", "RESERVADA", "ALQUILADA", "VENDIDA"] },
      ...(operation ? { operation } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-bold text-brand-gray-900">Máquinas</h1>
          <div className="mt-4 flex gap-2">
            {OPERATIONS.map((op) => (
              <Link
                key={op.value}
                href={op.value ? `/maquinas?operation=${op.value}` : "/maquinas"}
                className={clsx(
                  "rounded-full px-4 py-1.5 text-sm font-medium",
                  (operation ?? "") === op.value
                    ? "bg-brand-orange text-white"
                    : "bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200",
                )}
              >
                {op.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {machines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
            {machines.length === 0 ? (
              <p className="col-span-full text-brand-gray-500">
                No hay máquinas para este filtro todavía.
              </p>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
