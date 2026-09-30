# Swagemakers — Maqueta funcional

Maqueta funcional (no el sistema final) para mostrarle a Swagemakers — concesionario
oficial LiuGong en Resistencia, Chaco — cómo funcionaría su sistema de gestión: sitio
público de máquinas viales con tour 360°, CRM de leads con embudo de ventas, registro
de ventas de máquinas y repuestos, vendedores, y reportes descargables para auditoría.

## Cómo correrla

Requisitos: Node.js 18+.

```bash
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) para el sitio público, y
[http://localhost:3000/login](http://localhost:3000/login) para el panel interno.

**Login de demo** (ya viene precargado en el formulario):
- Email: `admin@swagemakers.com.ar`
- Contraseña: `swage2026`

Para volver a dejar los datos como al principio:

```bash
npm run db:reset
```

## Qué es real y qué está simulado en esta versión

Igual que con la maqueta de la inmobiliaria: esto es para la reunión, no producción.

**Funciona de verdad:**
- Alta, edición y baja de máquinas desde el panel — se reflejan al instante en el
  sitio público.
- Sitio público con catálogo, filtros por venta/alquiler y **tour 360°** por máquina
  (librería Pannellum, con una panorámica de muestra — se reemplaza por fotos 360°
  reales de cada máquina más adelante).
- **Embudo de ventas** (Leads) con etapas, origen y vendedor asignado.
- **Repuestos**: inventario y registro de ventas, con descuento de stock automático.
- **Ventas** de máquinas y de repuestos, con resumen por vendedor.
- **Reportes**: exportación real a CSV por rango de fechas (ventas de máquinas, ventas
  de repuestos y leads generados, con totales) — el "registro para auditar" que
  pidieron.
- Formulario de "Solicitar cotización" en cada ficha de máquina, que crea un lead real.

**Está simulado** (a propósito, para no depender de la cuenta de Meta Ads antes de
tener el visto bueno del cliente):
- Botón **"Simular lead de Meta Ads"** en Leads: genera en vivo un lead con una
  campaña de ejemplo, lo asigna a un vendedor y dispara una notificación — así se vería
  la automatización real una vez conectada la cuenta de Meta.

## Variables de entorno (`.env`)

Ver `.env.example`. Ya viene un `.env` con valores de desarrollo listos para correr la
demo tal cual.

## Fase 2 (una vez aprobado por el cliente)

1. Cuenta de Meta Business + Meta Lead Ads (formularios de captura de leads
   conectados por webhook) para reemplazar el botón de simulación.
2. WhatsApp Business API si quieren automatizar también ese canal.
3. Pasar la base de datos de SQLite a Postgres (cambiar `provider` en
   `prisma/schema.prisma`) y desplegar.
4. Autenticación multiusuario con roles (admin / vendedor, cada uno viendo solo sus
   leads).
5. Reemplazar las fotos y el tour 360° de muestra por material real de cada máquina.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Prisma (SQLite) + Pannellum para
los tours 360°. Server Actions para todas las mutaciones. Mismo patrón técnico que la
maqueta de Inmobiliaria Bataglia (proyecto hermano, repo separado).

## Nota sobre el deploy en Vercel

Este proyecto es completamente independiente del de la inmobiliaria (carpeta y
repositorio propios), pensado para poder conectarlo a un mismo proyecto de Vercel en
lugar del otro y así alternar qué maqueta se muestra en el mismo dominio, sin manejar
dos proyectos de Vercel en paralelo.
