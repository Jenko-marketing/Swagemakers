"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createVendor(formData: FormData) {
  await prisma.salesperson.create({
    data: {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
    },
  });
  revalidatePath("/dashboard/vendedores");
  revalidatePath("/dashboard/leads");
}
