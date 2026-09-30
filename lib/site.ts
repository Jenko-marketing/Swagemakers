export const SITE_NAME = "Swagemakers";
export const SITE_TAGLINE = "Máquinas Viales — Concesionario oficial LiuGong";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493624000000";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
