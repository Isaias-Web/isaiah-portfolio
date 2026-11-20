export type ActivityEntry = {
  id: string;
  publishedAt: string; // ISO 8601 with UTC offset
  category: string;
  title: string;
  summary: string;
  description: string;
};

// Publicaciones aprobadas exclusivamente. No introducir datos de clientes,
// credenciales, métricas privadas o detalles que identifiquen sistemas internos.
// Cada nueva entrada aquí provoca un deploy automático al fusionarse en main.
export const activityEntries: ActivityEntry[] = [];

// Ejemplos visibles únicamente en Development / Vercel Preview.
// No se incluyen en la API cuando VERCEL_ENV es production.
export const previewActivityEntries: ActivityEntry[] = [
  {
    id: "preview-activity-01",
    publishedAt: "2026-11-20T08:30:00-06:00",
    category: "FRONTEND",
    title: "Vista previa del módulo de actividad",
    summary: "Ejemplo para comprobar notificaciones y acordeones.",
    description:
      "Este registro es una demostración del componente Recent Activity. Permite verificar la aparición de notificaciones, el despliegue del panel y el comportamiento de las descripciones técnicas. No representa un trabajo entregado a un cliente.",
  },
  {
    id: "preview-activity-00",
    publishedAt: "2026-11-19T15:00:00-06:00",
    category: "UI / UX",
    title: "Ejemplo de registro archivado",
    summary: "Verificación del contador de actividades anteriores.",
    description: "Esta entrada solo se utiliza para comprobar el archivado visual.",
  },
];
