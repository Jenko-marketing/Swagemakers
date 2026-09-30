import Link from "next/link";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MachineCard } from "@/components/MachineCard";
import { waLink, SITE_TAGLINE } from "@/lib/site";
import { MessageCircle, Truck, Wrench, Sparkles } from "lucide-react";

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    prisma.machine.findMany({
      where: { featured: true, status: { in: ["DISPONIBLE", "RESERVADA"] } },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.machine.findMany({
      where: { status: { in: ["DISPONIBLE", "RESERVADA"] } },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const shown = featured.length ? featured : latest.slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-brand-navy text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-orange">
              {SITE_TAGLINE}
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              Máquinas viales LiuGong para tu obra, en venta o alquiler
            </h1>
            <p className="mt-4 max-w-xl text-brand-gray-200">
              Recorré cada máquina en 360° antes de ir al playón, y consultanos al
              instante por WhatsApp. Repuestos y service en Resistencia, Chaco.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/maquinas"
                className="rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
              >
                Ver máquinas
              </Link>
              <a
                href={waLink("Hola! Quiero más información sobre sus máquinas.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:border-white"
              >
                <MessageCircle size={16} /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-brand-gray-900">Destacadas</h2>
            <Link href="/maquinas" className="text-sm font-semibold text-brand-orange">
              Ver todas →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
            {shown.length === 0 ? (
              <p className="col-span-full text-brand-gray-500">
                Todavía no hay máquinas cargadas.
              </p>
            ) : null}
          </div>
        </section>

        <section className="border-t border-brand-gray-200 bg-brand-gray-50">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
            <Feature
              icon={<Sparkles size={20} />}
              title="Recorrido 360°"
              text="Mirá cada máquina desde todos los ángulos antes de ir a verla al playón."
            />
            <Feature
              icon={<Truck size={20} />}
              title="Venta y alquiler"
              text="Retropalas, motoniveladoras, palas cargadoras y más, 0km y usadas."
            />
            <Feature
              icon={<Wrench size={20} />}
              title="Repuestos y service"
              text="Stock de repuestos originales LiuGong y atención post-venta."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
        {icon}
      </span>
      <h3 className="mt-3 font-semibold text-brand-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-brand-gray-500">{text}</p>
    </div>
  );
}
