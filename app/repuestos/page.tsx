import { MessageCircle, PackageSearch } from "lucide-react";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { waLink } from "@/lib/site";

export default async function RepuestosPage() {
  const categories = await prisma.sparePart.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
            <PackageSearch size={22} />
          </span>
          <h1 className="mt-4 text-3xl font-bold text-brand-gray-900">
            Repuestos originales LiuGong
          </h1>
          <p className="mt-3 max-w-xl text-brand-gray-600">
            Tenemos stock permanente de repuestos originales para toda la línea
            LiuGong: filtros, mangueras, componentes hidráulicos, tren de rodaje y
            más. Contanos qué máquina tenés y te confirmamos disponibilidad al
            instante.
          </p>

          {categories.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c.category}
                  className="rounded-full bg-brand-gray-100 px-4 py-1.5 text-sm font-medium text-brand-gray-700"
                >
                  {c.category}
                </span>
              ))}
            </div>
          ) : null}

          <a
            href={waLink("Hola! Necesito consultar disponibilidad de un repuesto.")}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            <MessageCircle size={16} /> Consultar un repuesto por WhatsApp
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
