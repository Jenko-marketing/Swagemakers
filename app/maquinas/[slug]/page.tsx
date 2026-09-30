import Image from "next/image";
import { notFound } from "next/navigation";
import { Gauge, Calendar, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PanoramaViewer } from "@/components/PanoramaViewer";
import { Badge, machineStatusTone } from "@/components/Badge";
import {
  formatCurrency,
  parseImages,
  OPERATION_LABEL,
  MACHINE_STATUS_LABEL,
  MACHINE_CATEGORY_LABEL,
  CONDITION_LABEL,
} from "@/lib/format";
import { waLink } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";

export default async function MachineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const machine = await prisma.machine.findUnique({ where: { slug } });
  if (!machine) notFound();

  const images = parseImages(machine.images);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex gap-2">
                <Badge tone="gray">{OPERATION_LABEL[machine.operation]}</Badge>
                <Badge tone={machineStatusTone(machine.status)}>
                  {MACHINE_STATUS_LABEL[machine.status]}
                </Badge>
                <Badge tone="gray">{MACHINE_CATEGORY_LABEL[machine.category]}</Badge>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-brand-gray-900">
                {machine.title}
              </h1>
              <p className="mt-1 text-brand-gray-500">
                {machine.brand} {machine.model}
              </p>
            </div>
            <p className="text-3xl font-bold text-brand-orange-dark">
              {formatCurrency(machine.price, machine.currency)}
            </p>
          </div>

          {images.length > 0 ? (
            <div className="mt-8 grid grid-cols-4 gap-3">
              <div className="relative col-span-4 h-80 overflow-hidden rounded-xl bg-brand-gray-100 sm:col-span-3">
                <Image
                  src={images[0]}
                  alt={machine.title}
                  fill
                  sizes="(min-width: 640px) 66vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="col-span-4 grid grid-cols-4 gap-3 sm:col-span-1 sm:grid-cols-1">
                {images.slice(1, 4).map((src) => (
                  <div
                    key={src}
                    className="relative h-24 overflow-hidden rounded-lg bg-brand-gray-100 sm:h-24"
                  >
                    <Image src={src} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex gap-6 border-b border-brand-gray-200 pb-6 text-brand-gray-700">
                <span className="flex items-center gap-2">
                  <Calendar size={18} /> {CONDITION_LABEL[machine.condition]}
                  {machine.year ? ` · ${machine.year}` : ""}
                </span>
                {machine.hours ? (
                  <span className="flex items-center gap-2">
                    <Gauge size={18} /> {machine.hours.toLocaleString("es-AR")} horas de uso
                  </span>
                ) : null}
              </div>
              <h2 className="mt-6 text-lg font-semibold text-brand-gray-900">
                Descripción
              </h2>
              <p className="mt-2 whitespace-pre-line text-brand-gray-700">
                {machine.description}
              </p>

              {machine.panoramaUrl ? (
                <div className="mt-10">
                  <h2 className="text-lg font-semibold text-brand-gray-900">
                    Recorrido 360°
                  </h2>
                  <p className="mt-1 text-sm text-brand-gray-500">
                    Arrastrá para mirar alrededor y usá el zoom para acercarte.
                  </p>
                  <div className="mt-3">
                    <PanoramaViewer panoramaUrl={machine.panoramaUrl} title={machine.title} />
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="h-fit space-y-4 rounded-xl border border-brand-gray-200 bg-brand-gray-50 p-6">
              <div>
                <p className="font-semibold text-brand-gray-900">
                  ¿Te interesa esta máquina?
                </p>
                <p className="mt-1 text-sm text-brand-gray-500">
                  Escribinos por WhatsApp o dejanos tus datos y te contactamos.
                </p>
                <a
                  href={waLink(
                    `Hola! Vi "${machine.title}" (${machine.brand} ${machine.model}) y quiero más información.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
                >
                  <MessageCircle size={16} /> Consultar por WhatsApp
                </a>
              </div>
              <div className="border-t border-brand-gray-200 pt-4">
                <QuoteForm machineId={machine.id} machineTitle={machine.title} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
