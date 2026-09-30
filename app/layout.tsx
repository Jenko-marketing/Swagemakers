import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swagemakers — Máquinas Viales",
  description:
    "Concesionario oficial LiuGong en Resistencia, Chaco — máquinas viales en venta y alquiler, repuestos y service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-brand-gray-900">
        {children}
      </body>
    </html>
  );
}
