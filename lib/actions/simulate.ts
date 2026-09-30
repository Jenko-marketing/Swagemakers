"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
}

const CAMPAIGNS = [
  "Retropalas 0km — Octubre",
  "Plan Ahorro LiuGong",
  "Motoniveladoras usadas — Liquidación",
  "Palas cargadoras — Financiación",
];

const CONTACTS = [
  { name: "Hugo Benítez", phone: "+54 9 3624 55-1023" },
  { name: "Marcela Ríos", phone: "+54 9 3624 55-2087" },
  { name: "Sergio Acuña", phone: "+54 9 3624 55-3341" },
  { name: "Diego Palacios", phone: "+54 9 3624 55-4498" },
  { name: "Romina Cáceres", phone: "+54 9 3624 55-5502" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function simulateMetaAdsLead() {
  const machine = await prisma.machine.findFirst({
    where: { status: "DISPONIBLE" },
    orderBy: { createdAt: "desc" },
  });

  const vendors = await prisma.salesperson.findMany({ where: { active: true } });
  const vendor = vendors.length ? pick(vendors) : null;

  const contact = pick(CONTACTS);
  const campaign = pick(CAMPAIGNS);

  const lead = await prisma.lead.create({
    data: {
      name: contact.name,
      phone: contact.phone,
      source: "META_ADS",
      campaign,
      stage: "NUEVO",
      machineId: machine?.id,
      vendorId: vendor?.id,
      estValue: machine?.price,
      notes: `Completó el formulario de la campaña "${campaign}"${
        machine ? ` interesado en ${machine.title}` : ""
      }.`,
    },
  });

  await prisma.notification.create({
    data: {
      title: "Nuevo lead de Meta Ads",
      body: `${contact.name} — campaña "${campaign}"${
        vendor ? `, asignado a ${vendor.name}` : ""
      }.`,
      kind: "LEAD_META_ADS",
    },
  });

  revalidateAll();
  return { ok: true as const, leadId: lead.id };
}

/** Wrapper sin argumentos para usar directamente como action de un <form>. */
export async function triggerMetaAdsLeadSimulation() {
  await simulateMetaAdsLead();
}
