export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function toDateInputValue(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const MACHINE_CATEGORY_LABEL: Record<string, string> = {
  RETROPALA: "Retropala",
  MOTONIVELADORA: "Motoniveladora",
  PALA_CARGADORA: "Pala cargadora",
  EXCAVADORA: "Excavadora",
  COMPACTADOR: "Compactador",
  TOPADORA: "Topadora",
  CAMION: "Camión",
  OTRO: "Otro",
};

export const OPERATION_LABEL: Record<string, string> = {
  VENTA: "Venta",
  ALQUILER: "Alquiler",
};

export const CONDITION_LABEL: Record<string, string> = {
  NUEVA: "0 km",
  USADA: "Usada",
};

export const MACHINE_STATUS_LABEL: Record<string, string> = {
  DISPONIBLE: "Disponible",
  RESERVADA: "Reservada",
  VENDIDA: "Vendida",
  ALQUILADA: "Alquilada",
};

export const LEAD_SOURCE_LABEL: Record<string, string> = {
  META_ADS: "Meta Ads",
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  REFERIDO: "Referido",
  MANUAL: "Manual",
};

export const LEAD_STAGE_LABEL: Record<string, string> = {
  NUEVO: "Nuevo",
  CONTACTADO: "Contactado",
  COTIZANDO: "Cotizando",
  NEGOCIACION: "Negociación",
  GANADO: "Ganado",
  PERDIDO: "Perdido",
};
