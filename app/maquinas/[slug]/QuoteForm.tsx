"use client";

import { useActionState } from "react";
import { requestQuote } from "@/lib/actions/leads";

type State = { sent: boolean };

async function action(_prev: State, formData: FormData): Promise<State> {
  await requestQuote(formData);
  return { sent: true };
}

export function QuoteForm({
  machineId,
  machineTitle,
}: {
  machineId: string;
  machineTitle: string;
}) {
  const [state, formAction, pending] = useActionState(action, { sent: false });

  if (state.sent) {
    return (
      <p className="rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
        ¡Listo! Ya registramos tu consulta por &quot;{machineTitle}&quot;, te
        contactamos a la brevedad.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="machineId" value={machineId} />
      <p className="text-sm font-medium text-brand-gray-700">
        O dejanos tus datos:
      </p>
      <input
        name="name"
        placeholder="Tu nombre"
        required
        className="w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
      />
      <input
        name="phone"
        placeholder="Tu teléfono"
        required
        className="w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg border border-brand-navy px-4 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Solicitar cotización"}
      </button>
    </form>
  );
}
