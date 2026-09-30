import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PANORAMA_URL = "https://cdn.jsdelivr.net/gh/mpetroff/pannellum@master/examples/examplepano.jpg";

function img(seed: string, w = 1200, h = 800) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  console.log("Limpiando datos existentes...");
  await prisma.notification.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.machineSale.deleteMany();
  await prisma.partSale.deleteMany();
  await prisma.sparePart.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.salesperson.deleteMany();
  await prisma.adminUser.deleteMany();

  console.log("Creando usuario admin...");
  await prisma.adminUser.create({
    data: {
      email: "admin@swagemakers.com.ar",
      passwordHash: await bcrypt.hash("swage2026", 10),
      name: "Equipo Swagemakers",
    },
  });

  console.log("Creando vendedores...");
  const [martin, lucas, carla] = await Promise.all([
    prisma.salesperson.create({ data: { name: "Martín Ferreyra", phone: "+54 9 3624 40-1111" } }),
    prisma.salesperson.create({ data: { name: "Lucas Domínguez", phone: "+54 9 3624 40-2222" } }),
    prisma.salesperson.create({ data: { name: "Carla Sosa", phone: "+54 9 3624 40-3333" } }),
  ]);

  console.log("Creando máquinas...");
  const retropala0km = await prisma.machine.create({
    data: {
      slug: "retropala-liugong-766-0km",
      title: "Retropala LiuGong 766 0km",
      brand: "LiuGong",
      model: "766",
      category: "RETROPALA",
      operation: "VENTA",
      condition: "NUEVA",
      year: 2026,
      price: 95000,
      currency: "USD",
      status: "DISPONIBLE",
      featured: true,
      description:
        "Motor Cummins original, transmisión y diferenciales Carraro. Potencia y versatilidad para múltiples trabajos, excelente capacidad de carga y excavación. Incluye garantía oficial, service postventa y repuestos originales. Financiación disponible en 18, 24 o 36 cuotas en pesos.",
      coverImage: "/machines/retropala-766.jpg",
      images: JSON.stringify(["/machines/retropala-766.jpg"]),
      panoramaUrl: PANORAMA_URL,
    },
  });

  const palaCargadora = await prisma.machine.create({
    data: {
      slug: "pala-cargadora-liugong-835n-0km",
      title: "Pala cargadora LiuGong 835N 0km",
      brand: "LiuGong",
      model: "835N",
      category: "PALA_CARGADORA",
      operation: "VENTA",
      condition: "NUEVA",
      year: 2026,
      price: 145000,
      currency: "USD",
      status: "DISPONIBLE",
      featured: true,
      description:
        "Preparada para rendir en los trabajos más exigentes. Ideal para mover grandes volúmenes con eficiencia: alto rendimiento, operación estable, pensada para construcción, canteras y logística.",
      coverImage: "/machines/pala-835n.jpg",
      images: JSON.stringify(["/machines/pala-835n.jpg"]),
      panoramaUrl: PANORAMA_URL,
    },
  });

  const motoniveladora = await prisma.machine.create({
    data: {
      slug: "motoniveladora-clg4165d-usada",
      title: "Motoniveladora LiuGong CLG4165D",
      brand: "LiuGong",
      model: "CLG4165D",
      category: "MOTONIVELADORA",
      operation: "VENTA",
      condition: "USADA",
      year: 2019,
      hours: 4200,
      price: 88000,
      currency: "USD",
      status: "DISPONIBLE",
      description:
        "Motoniveladora con 4200 horas de uso, mantenimiento al día, cuchilla y escarificador en buen estado.",
      coverImage: img("swage-moto-1"),
      images: JSON.stringify([img("swage-moto-1"), img("swage-moto-2")]),
    },
  });

  const excavadora = await prisma.machine.create({
    data: {
      slug: "excavadora-clg922e-0km",
      title: "Excavadora LiuGong CLG922E 0km",
      brand: "LiuGong",
      model: "CLG922E",
      category: "EXCAVADORA",
      operation: "VENTA",
      condition: "NUEVA",
      year: 2026,
      price: 168000,
      currency: "USD",
      status: "DISPONIBLE",
      featured: true,
      description:
        "Excavadora de 22 toneladas, sistema hidráulico de última generación, cabina presurizada. Disponible con orugas de acero o goma.",
      coverImage: img("swage-excavadora-1"),
      images: JSON.stringify([img("swage-excavadora-1"), img("swage-excavadora-2"), img("swage-excavadora-3")]),
      panoramaUrl: PANORAMA_URL,
    },
  });

  const compactador = await prisma.machine.create({
    data: {
      slug: "compactador-clg6115e-alquiler",
      title: "Compactador LiuGong CLG6115E",
      brand: "LiuGong",
      model: "CLG6115E",
      category: "COMPACTADOR",
      operation: "ALQUILER",
      condition: "USADA",
      year: 2020,
      hours: 1800,
      price: 3500,
      currency: "USD",
      status: "DISPONIBLE",
      description:
        "Compactador vibratorio liso, ideal para bases y sub-bases viales. Alquiler mensual, incluye traslado dentro de Chaco.",
      coverImage: img("swage-compactador-1"),
      images: JSON.stringify([img("swage-compactador-1"), img("swage-compactador-2")]),
    },
  });

  const retropalaAlquiler = await prisma.machine.create({
    data: {
      slug: "retropala-wz30-25-alquiler",
      title: "Retropala LiuGong WZ30-25 (alquiler)",
      brand: "LiuGong",
      model: "WZ30-25",
      category: "RETROPALA",
      operation: "ALQUILER",
      condition: "USADA",
      year: 2021,
      hours: 2600,
      price: 2800,
      currency: "USD",
      status: "ALQUILADA",
      description: "Retropala en alquiler mensual, con operador opcional.",
      coverImage: img("swage-retro-alq-1"),
      images: JSON.stringify([img("swage-retro-alq-1")]),
    },
  });

  const topadora = await prisma.machine.create({
    data: {
      slug: "topadora-clg-t140-usada",
      title: "Topadora LiuGong T140",
      brand: "LiuGong",
      model: "T140",
      category: "TOPADORA",
      operation: "VENTA",
      condition: "USADA",
      year: 2018,
      hours: 6000,
      price: 120000,
      currency: "USD",
      status: "DISPONIBLE",
      description: "Topadora con hoja recta, tren de rodaje renovado hace 800 horas.",
      coverImage: img("swage-topadora-1"),
      images: JSON.stringify([img("swage-topadora-1"), img("swage-topadora-2")]),
    },
  });

  const camion = await prisma.machine.create({
    data: {
      slug: "camion-volcador-usado",
      title: "Camión volcador 6x4",
      brand: "LiuGong",
      model: "Serie C",
      category: "CAMION",
      operation: "VENTA",
      condition: "USADA",
      year: 2020,
      hours: 3100,
      price: 75000,
      currency: "USD",
      status: "RESERVADA",
      description: "Camión volcador 6x4, caja de 14m³, service al día.",
      coverImage: img("swage-camion-1"),
      images: JSON.stringify([img("swage-camion-1")]),
    },
  });

  console.log("Creando repuestos...");
  const parts = await Promise.all([
    prisma.sparePart.create({
      data: { code: "FA-2201", name: "Filtro de aire CLG", category: "Filtros", stock: 18, price: 85 },
    }),
    prisma.sparePart.create({
      data: { code: "FH-3310", name: "Filtro hidráulico", category: "Filtros", stock: 12, price: 120 },
    }),
    prisma.sparePart.create({
      data: { code: "MG-1187", name: "Manguera hidráulica 1/2\"", category: "Hidráulica", stock: 30, price: 45 },
    }),
    prisma.sparePart.create({
      data: { code: "DB-5502", name: "Diente de balde", category: "Desgaste", stock: 40, price: 60 },
    }),
    prisma.sparePart.create({
      data: { code: "KJ-9020", name: "Kit de juntas motor", category: "Motor", stock: 6, price: 310 },
    }),
    prisma.sparePart.create({
      data: { code: "CA-4471", name: "Correa alternador", category: "Motor", stock: 22, price: 38 },
    }),
  ]);

  console.log("Creando ventas de ejemplo...");
  await prisma.machineSale.create({
    data: {
      machineId: camion.id,
      vendorId: martin.id,
      buyerName: "Cooperativa Vial del Norte",
      amount: 73000,
      currency: "USD",
      date: daysAgo(6),
    },
  });

  await prisma.partSale.create({
    data: {
      partId: parts[3].id,
      vendorId: lucas.id,
      quantity: 8,
      unitPrice: 60,
      total: 480,
      customerName: "Construcciones Paraná SRL",
      date: daysAgo(3),
    },
  });
  await prisma.partSale.create({
    data: {
      partId: parts[0].id,
      vendorId: carla.id,
      quantity: 4,
      unitPrice: 85,
      total: 340,
      customerName: "Vialidad Provincial",
      date: daysAgo(10),
    },
  });
  await prisma.sparePart.update({ where: { id: parts[3].id }, data: { stock: { decrement: 8 } } });
  await prisma.sparePart.update({ where: { id: parts[0].id }, data: { stock: { decrement: 4 } } });

  console.log("Creando leads de ejemplo...");
  await prisma.lead.createMany({
    data: [
      {
        name: "Rubén Achával",
        phone: "+54 9 3624 60-1001",
        source: "META_ADS",
        campaign: "Retropalas 0km — Octubre",
        stage: "NUEVO",
        machineId: retropala0km.id,
        vendorId: martin.id,
        estValue: 95000,
        notes: "Completó el formulario de la campaña de retropalas.",
      },
      {
        name: "Estudio Vial Chaco",
        phone: "+54 9 3624 60-1002",
        source: "META_ADS",
        campaign: "Plan Ahorro LiuGong",
        stage: "CONTACTADO",
        machineId: palaCargadora.id,
        vendorId: lucas.id,
        estValue: 145000,
        notes: "Preguntó por financiación a 24 meses.",
      },
      {
        name: "Municipalidad de Villa Ángela",
        phone: "+54 9 3624 60-1003",
        source: "WHATSAPP",
        stage: "COTIZANDO",
        machineId: motoniveladora.id,
        vendorId: martin.id,
        estValue: 88000,
        notes: "Pidió cotización formal para licitación.",
      },
      {
        name: "Hormigonera Resistencia",
        phone: "+54 9 3624 60-1004",
        source: "INSTAGRAM",
        stage: "NEGOCIACION",
        machineId: excavadora.id,
        vendorId: carla.id,
        estValue: 165000,
        notes: "Negociando forma de pago, entrega en 30 días.",
      },
      {
        name: "Cooperativa Vial del Norte",
        phone: "+54 9 3624 60-1005",
        source: "REFERIDO",
        stage: "GANADO",
        machineId: camion.id,
        vendorId: martin.id,
        estValue: 73000,
        notes: "Venta cerrada — ver registro en Ventas.",
      },
      {
        name: "Transportes del Litoral",
        phone: "+54 9 3624 60-1006",
        source: "META_ADS",
        campaign: "Motoniveladoras usadas — Liquidación",
        stage: "PERDIDO",
        vendorId: lucas.id,
        notes: "Eligió otra marca por plazo de entrega.",
      },
    ],
  });

  console.log("Listo ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
