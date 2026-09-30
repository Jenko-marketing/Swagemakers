"use client";

import { useTransition } from "react";
import { updateMachineStatus } from "@/lib/actions/machines";
import { MACHINE_STATUS_LABEL } from "@/lib/format";

const STATUSES = Object.keys(MACHINE_STATUS_LABEL);

export function MachineStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateMachineStatus(id, e.target.value))}
      className="rounded-lg border border-brand-gray-300 bg-white px-2 py-1 text-xs font-medium text-brand-gray-700 disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {MACHINE_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
