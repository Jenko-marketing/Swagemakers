"use client";

import { useTransition } from "react";
import { assignVendor } from "@/lib/actions/leads";

export function VendorSelect({
  leadId,
  vendorId,
  vendors,
}: {
  leadId: string;
  vendorId: string | null;
  vendors: { id: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={vendorId ?? ""}
      disabled={pending}
      onChange={(e) => startTransition(() => assignVendor(leadId, e.target.value))}
      className="rounded-lg border border-brand-gray-300 bg-white px-2 py-1 text-xs font-medium text-brand-gray-700 disabled:opacity-60"
    >
      <option value="">Sin asignar</option>
      {vendors.map((v) => (
        <option key={v.id} value={v.id}>
          {v.name}
        </option>
      ))}
    </select>
  );
}
