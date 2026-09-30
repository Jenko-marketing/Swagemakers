"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";

function revalidateAll() {
  revalidatePath("/dashboard/ventas");
  revalidatePath("/dashboard/maquinas");
  revalidatePath("/dashboard");
  revalidatePath("/maquinas");
}

export async function registerMachineSale(formData: FormData) {
  const machineId = String(formData.get("machineId") ?? "");
  const buyerName = String(formData.get("buyerName") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const vendorId = String(formData.get("vendorId") ?? "") || null;
  if (!machineId || !buyerName || amount <= 0) return;

  const machine = await prisma.machine.findUnique({ where: { id: machineId } });
  if (!machine) return;

  await prisma.machineSale.create({
    data: { machineId, buyerName, amount, currency: machine.currency, vendorId },
  });

  await prisma.machine.update({
    where: { id: machineId },
    data: { status: machine.operation === "ALQUILER" ? "ALQUILADA" : "VENDIDA" },
  });

  await prisma.notification.create({
    data: {
      title: "Venta de máquina registrada",
      body: `${machine.title} a ${buyerName} (${formatCurrency(amount, machine.currency)})`,
      kind: "VENTA_MAQUINA",
    },
  });

  revalidateAll();
}
