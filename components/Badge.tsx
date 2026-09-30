import { clsx } from "clsx";

type Tone = "green" | "red" | "amber" | "gray" | "blue" | "orange";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  gray: "bg-brand-gray-100 text-brand-gray-700 ring-brand-gray-300",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  orange: "bg-brand-orange-light text-brand-orange-dark ring-brand-orange/20",
};

export function Badge({
  children,
  tone = "gray",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function machineStatusTone(status: string): Tone {
  if (status === "DISPONIBLE") return "green";
  if (status === "RESERVADA") return "amber";
  return "gray";
}

export function leadStageTone(stage: string): Tone {
  if (stage === "GANADO") return "green";
  if (stage === "PERDIDO") return "red";
  if (stage === "NEGOCIACION" || stage === "COTIZANDO") return "orange";
  return "gray";
}

export function leadSourceTone(source: string): Tone {
  if (source === "META_ADS") return "blue";
  if (source === "WHATSAPP") return "green";
  if (source === "INSTAGRAM") return "orange";
  return "gray";
}
