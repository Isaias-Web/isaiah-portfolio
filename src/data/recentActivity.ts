export type ActivityEntry = {
  id: string;
  publishedAt: string;
  category: string;
  title: string;
  summary: string;
  description: string;
};

// Datos de demostración, NO publicaciones reales.
// Reemplazar por entradas revisadas y autorizadas antes de publicar.
export const activityEntries: ActivityEntry[] = [
  {
    id: "demo-01",
    publishedAt: "2026-11-19T15:00:00-06:00",
    category: "FRONTEND",
    title: "Vista previa del módulo de actividad",
    summary: "Prueba de un panel integrado al portfolio.",
    description:
      "Esta es una entrada de ejemplo para comprobar el diseño del listado, la apertura del acordeón y la lectura de descripciones técnicas. No representa una entrega publicada.",
  },
  {
    id: "demo-00",
    publishedAt: "2026-11-18T15:00:00-06:00",
    category: "UI / UX",
    title: "Entrada de archivo (demostración)",
    summary: "Dato de prueba para validar el contador.",
    description:
      "Esta entrada solamente sirve para comprobar que los elementos de días anteriores dejan de aparecer y se suman al contador.",
  },
];