import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

function csvEscape(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function row(values: unknown[]): string {
  return values.map(csvEscape).join(",") + "\r\n";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fromStr = searchParams.get("from");
  const toStr = searchParams.get("to");

  const from = fromStr ? new Date(`${fromStr}T00:00:00`) : new Date("2000-01-01");
  const to = toStr ? new Date(`${toStr}T23:59:59`) : new Date();

  const [machineSales, partSales, leads] = await Promise.all([
    prisma.machineSale.findMany({
      where: { date: { gte: from, lte: to } },
      include: { machine: true, vendor: true },
      orderBy: { date: "asc" },
    }),
    prisma.partSale.findMany({
      where: { date: { gte: from, lte: to } },
      include: { part: true, vendor: true },
      orderBy: { date: "asc" },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: from, lte: to } },
      include: { machine: true, vendor: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  let csv = "";
  csv += `Reporte Swagemakers — ${fromStr ?? "inicio"} a ${toStr ?? "hoy"}\r\n\r\n`;

  csv += "VENTAS DE MAQUINAS\r\n";
  csv += row(["Fecha", "Maquina", "Comprador", "Vendedor", "Monto", "Moneda"]);
  for (const s of machineSales) {
    csv += row([
      s.date.toISOString().slice(0, 10),
      s.machine.title,
      s.buyerName,
      s.vendor?.name ?? "",
      s.amount,
      s.currency,
    ]);
  }
  const totalMaquinas = machineSales.reduce((acc, s) => acc + s.amount, 0);
  csv += row(["", "", "", "TOTAL", totalMaquinas, ""]);

  csv += "\r\nVENTAS DE REPUESTOS\r\n";
  csv += row(["Fecha", "Repuesto", "Cantidad", "Cliente", "Vendedor", "Total", "Moneda"]);
  for (const s of partSales) {
    csv += row([
      s.date.toISOString().slice(0, 10),
      s.part.name,
      s.quantity,
      s.customerName,
      s.vendor?.name ?? "",
      s.total,
      s.part.currency,
    ]);
  }
  const totalRepuestos = partSales.reduce((acc, s) => acc + s.total, 0);
  csv += row(["", "", "", "", "TOTAL", totalRepuestos, ""]);

  csv += "\r\nLEADS GENERADOS\r\n";
  csv += row(["Fecha", "Nombre", "Telefono", "Origen", "Campana", "Etapa", "Maquina de interes", "Vendedor"]);
  for (const l of leads) {
    csv += row([
      l.createdAt.toISOString().slice(0, 10),
      l.name,
      l.phone,
      l.source,
      l.campaign ?? "",
      l.stage,
      l.machine?.title ?? "",
      l.vendor?.name ?? "",
    ]);
  }

  const filename = `reporte-swagemakers_${fromStr ?? "inicio"}_a_${toStr ?? "hoy"}.csv`;

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
