"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function revalidateAll() {
  revalidatePath("/dashboard/repuestos");
  revalidatePath("/dashboard/ventas");
  revalidatePath("/dashboard");
  revalidatePath("/repuestos");
}

export async function createPart(formData: FormData) {
  await prisma.sparePart.create({
    data: {
      code: String(formData.get("code") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "General"),
      stock: Number(formData.get("stock") ?? 0),
      price: Number(formData.get("price") ?? 0),
      currency: String(formData.get("currency") ?? "USD"),
    },
  });
  revalidateAll();
}

export async function registerPartSale(formData: FormData) {
  const partId = String(formData.get("partId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  const customerName = String(formData.get("customerName") ?? "");
  const vendorId = String(formData.get("vendorId") ?? "") || null;
  if (!partId || quantity <= 0 || !customerName) return;

  const part = await prisma.sparePart.findUnique({ where: { id: partId } });
  if (!part) return;

  const unitPrice = part.price;
  const total = unitPrice * quantity;

  await prisma.partSale.create({
    data: { partId, quantity, unitPrice, total, customerName, vendorId },
  });

  await prisma.sparePart.update({
    where: { id: partId },
    data: { stock: Math.max(0, part.stock - quantity) },
  });

  await prisma.notification.create({
    data: {
      title: "Venta de repuesto registrada",
      body: `${quantity}x ${part.name} a ${customerName} (${new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: part.currency,
        maximumFractionDigits: 0,
      }).format(total)})`,
      kind: "VENTA_REPUESTO",
    },
  });

  revalidateAll();
}
