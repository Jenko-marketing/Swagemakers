import { prisma } from "@/lib/db";
import { Badge, leadSourceTone } from "@/components/Badge";
import { LeadStageSelect } from "@/components/LeadStageSelect";
import { VendorSelect } from "@/components/VendorSelect";
import { SimulateMetaAdsButton } from "@/components/SimulateMetaAdsButton";
import { createLead } from "@/lib/actions/leads";
import { LEAD_STAGE_LABEL, LEAD_SOURCE_LABEL, formatDateTime, formatCurrency } from "@/lib/format";
import { Phone, Truck } from "lucide-react";

const COLUMNS = ["NUEVO", "CONTACTADO", "COTIZANDO", "NEGOCIACION", "GANADO", "PERDIDO"];

export default async function LeadsPage() {
  const [leads, vendors] = await Promise.all([
    prisma.lead.findMany({
      include: { machine: true, vendor: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.salesperson.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  const byStage = Object.fromEntries(COLUMNS.map((c) => [c, leads.filter((l) => l.stage === c)]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Leads / Embudo de ventas</h1>
          <p className="mt-1 text-sm text-brand-gray-500">
            Seguimiento de consultas, origen (Meta Ads, WhatsApp, etc.) y vendedor asignado.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SimulateMetaAdsButton />
        </div>
      </div>

      <form action={createLead} className="mt-4 flex flex-wrap gap-2">
        <input
          name="name"
          placeholder="Nombre"
          required
          className="w-36 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm"
        />
        <input
          name="phone"
          placeholder="Teléfono"
          required
          className="w-36 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm"
        />
        <select name="source" defaultValue="MANUAL" className="rounded-lg border border-brand-gray-300 px-3 py-2 text-sm">
          {Object.entries(LEAD_SOURCE_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          + Lead manual
        </button>
      </form>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((stage) => (
          <div key={stage} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-brand-gray-700">
                {LEAD_STAGE_LABEL[stage]}
              </h2>
              <span className="text-xs text-brand-gray-400">{byStage[stage].length}</span>
            </div>
            <div className="space-y-3">
              {byStage[stage].map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl border border-brand-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-brand-gray-900">{lead.name}</p>
                    <Badge tone={leadSourceTone(lead.source)}>
                      {LEAD_SOURCE_LABEL[lead.source] ?? lead.source}
                    </Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-brand-gray-500">
                    <Phone size={12} /> {lead.phone}
                  </p>
                  {lead.machine ? (
                    <p className="mt-1 flex items-center gap-1 text-xs text-brand-gray-500">
                      <Truck size={12} /> {lead.machine.title}
                    </p>
                  ) : null}
                  {lead.campaign ? (
                    <p className="mt-1 text-xs font-medium text-blue-700">
                      Campaña: {lead.campaign}
                    </p>
                  ) : null}
                  {lead.notes ? (
                    <p className="mt-2 text-sm text-brand-gray-700">{lead.notes}</p>
                  ) : null}
                  {lead.estValue ? (
                    <p className="mt-1 text-xs font-medium text-brand-gray-500">
                      Valor estimado: {formatCurrency(lead.estValue)}
                    </p>
                  ) : null}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-brand-gray-400">
                      {formatDateTime(lead.createdAt)}
                    </span>
                    <LeadStageSelect id={lead.id} stage={lead.stage} />
                  </div>
                  <div className="mt-2">
                    <VendorSelect
                      leadId={lead.id}
                      vendorId={lead.vendorId}
                      vendors={vendors}
                    />
                  </div>
                </div>
              ))}
              {byStage[stage].length === 0 ? (
                <p className="rounded-xl border border-dashed border-brand-gray-200 p-4 text-center text-xs text-brand-gray-400">
                  Sin leads
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
