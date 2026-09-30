import Image from "next/image";
import Link from "next/link";
import { Gauge, Calendar, MapPin } from "lucide-react";
import type { Machine } from "@prisma/client";
import { Badge, machineStatusTone } from "@/components/Badge";
import {
  formatCurrency,
  OPERATION_LABEL,
  MACHINE_STATUS_LABEL,
  CONDITION_LABEL,
} from "@/lib/format";

export function MachineCard({ machine }: { machine: Machine }) {
  return (
    <Link
      href={`/maquinas/${machine.slug}`}
      className="group block overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative h-52 w-full overflow-hidden bg-brand-gray-100">
        {machine.coverImage ? (
          <Image
            src={machine.coverImage}
            alt={machine.title}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="gray" className="bg-white/90">
            {OPERATION_LABEL[machine.operation] ?? machine.operation}
          </Badge>
          <Badge tone={machineStatusTone(machine.status)} className="bg-white/90">
            {MACHINE_STATUS_LABEL[machine.status] ?? machine.status}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-brand-navy">
          {formatCurrency(machine.price, machine.currency)}
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold text-brand-gray-900">
          {machine.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-brand-gray-500">
          <MapPin size={14} /> {machine.brand} {machine.model}
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-brand-gray-700">
          <span className="flex items-center gap-1">
            <Calendar size={15} /> {CONDITION_LABEL[machine.condition]}
            {machine.year ? ` · ${machine.year}` : ""}
          </span>
          {machine.hours ? (
            <span className="flex items-center gap-1">
              <Gauge size={15} /> {machine.hours.toLocaleString("es-AR")} hs
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
