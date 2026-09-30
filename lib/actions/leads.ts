"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function revalidateAll() {
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
}

export async function updateLeadStage(id: string, stage: string) {
  await prisma.lead.update({ where: { id }, data: { stage } });
  revalidateAll();
}

export async function assignVendor(id: string, vendorId: string) {
  await prisma.lead.update({
    where: { id },
    data: { vendorId: vendorId || null },
  });
  revalidateAll();
}

export async function createLead(formData: FormData) {
  await prisma.lead.create({
    data: {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      source: String(formData.get("source") ?? "Manual"),
      notes: String(formData.get("notes") ?? "") || null,
      stage: "NUEVO",
    },
  });
  revalidateAll();
}

export async function requestQuote(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const machineId = String(formData.get("machineId") ?? "") || null;
  if (!name || !phone) return;

  await prisma.lead.create({
    data: {
      name,
      phone,
      source: "MANUAL",
      stage: "NUEVO",
      machineId,
      notes: "Solicitó cotización desde la ficha de la máquina en el sitio.",
    },
  });

  await prisma.notification.create({
    data: {
      title: "Nueva solicitud de cotización",
      body: `${name} (${phone}) pidió cotización desde el sitio.`,
      kind: "LEAD_NUEVO",
    },
  });

  revalidateAll();
}
