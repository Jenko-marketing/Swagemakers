"use client";

import { useTransition } from "react";
import { updateLeadStage } from "@/lib/actions/leads";
import { LEAD_STAGE_LABEL } from "@/lib/format";

const STAGES = Object.keys(LEAD_STAGE_LABEL);

export function LeadStageSelect({ id, stage }: { id: string; stage: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={stage}
      disabled={pending}
      onChange={(e) => startTransition(() => updateLeadStage(id, e.target.value))}
      className="rounded-lg border border-brand-gray-300 bg-white px-2 py-1 text-xs font-medium text-brand-gray-700 disabled:opacity-60"
    >
      {STAGES.map((s) => (
        <option key={s} value={s}>
          {LEAD_STAGE_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
