"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6)
  );
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/maquinas");
  revalidatePath("/dashboard/maquinas");
  revalidatePath("/dashboard");
}

function readCommon(formData: FormData) {
  const images = String(formData.get("images") ?? "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  return {
    title: String(formData.get("title") ?? ""),
    brand: String(formData.get("brand") ?? "LiuGong"),
    model: String(formData.get("model") ?? ""),
    category: String(formData.get("category") ?? "RETROPALA"),
    operation: String(formData.get("operation") ?? "VENTA"),
    condition: String(formData.get("condition") ?? "NUEVA"),
    year: formData.get("year") ? Number(formData.get("year")) : null,
    hours: formData.get("hours") ? Number(formData.get("hours")) : null,
    price: Number(formData.get("price") ?? 0),
    currency: String(formData.get("currency") ?? "USD"),
    status: String(formData.get("status") ?? "DISPONIBLE"),
    description: String(formData.get("description") ?? ""),
    coverImage: images[0] ?? "",
    images: JSON.stringify(images),
    panoramaUrl: String(formData.get("panoramaUrl") ?? "") || null,
    featured: formData.get("featured") === "on",
  };
}

export async function createMachine(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("El título es obligatorio");

  await prisma.machine.create({
    data: { ...readCommon(formData), slug: slugify(title) },
  });

  revalidateAll();
  redirect("/dashboard/maquinas");
}

export async function updateMachineStatus(id: string, status: string) {
  await prisma.machine.update({ where: { id }, data: { status } });
  revalidateAll();
}

export async function updateMachine(id: string, formData: FormData) {
  await prisma.machine.update({ where: { id }, data: readCommon(formData) });
  revalidateAll();
  redirect("/dashboard/maquinas");
}

export async function deleteMachine(id: string) {
  await prisma.machine.deleteMany({ where: { id } });
  revalidateAll();
  redirect("/dashboard/maquinas");
}
