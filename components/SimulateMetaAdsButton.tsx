"use client";

import { useTransition } from "react";
import { Sparkles } from "lucide-react";
import { triggerMetaAdsLeadSimulation } from "@/lib/actions/simulate";

export function SimulateMetaAdsButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => triggerMetaAdsLeadSimulation())}
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
    >
      <Sparkles size={16} />
      {pending ? "Simulando..." : "Simular lead de Meta Ads"}
    </button>
  );
}
