export type ActivityProgress = {
  at: string; // ISO 8601 con zona horaria
  stage: string; // Etapa real, no generada con temporizadores
  note: string; // Breve avance publicable y verificable
};

export type ActivityEntry = {
  id: string;
  publishedAt: string; // Registro inicial
  updatedAt?: string; // Cambiar al registrar un avance o completar la tarea
  status: "in_progress" | "completed";
  category: string;
  title: string;
  summary: string;
  // Las solicitudes en progreso no se pueden expandir.
  description?: string;
  // Solo etapas que efectivamente se hayan realizado y autorizado.
  progress?: ActivityProgress[];
};

// Publicaciones aprobadas. Nunca incluir datos privados, URLs internas,
// información de clientes o procesos que no se hayan realizado.
export const activityEntries: ActivityEntry[] = [];

// Datos de prueba, exclusivos de desarrollo y preview de Vercel.
export const previewActivityEntries: ActivityEntry[] = [
  {
    id: "preview-request-01",
    publishedAt: "2026-11-20T09:00:00-06:00",
    updatedAt: "2026-11-20T09:24:00-06:00",
    status: "in_progress",
    category: "WEB ENGINEERING",
    title: "Solicitud de mejoras técnicas (DEMO)",
    summary: "Revisión de requisitos y exploración de alternativas en curso.",
    progress: [
      {
        at: "2026-11-20T09:00:00-06:00",
        stage: "Solicitud recibida",
        note: "Registro del objetivo y del alcance inicial.",
      },
      {
        at: "2026-11-20T09:12:00-06:00",
        stage: "Revisión",
        note: "Análisis de requisitos y restricciones.",
      },
      {
        at: "2026-11-20T09:24:00-06:00",
        stage: "Investigación",
        note: "Comparación de posibles soluciones.",
      },
    ],
  },
  {
    id: "preview-completed-01",
    publishedAt: "2026-11-20T08:30:00-06:00",
    updatedAt: "2026-11-20T08:55:00-06:00",
    status: "completed",
    category: "FRONTEND",
    title: "Vista previa del módulo de actividad (DEMO)",
    summary: "Ejemplo de reporte técnico finalizado.",
    description:
      "Se preparó un ejemplo visual para comprobar el listado y la interacción del panel. Es un registro de demostración y no representa una implementación de cliente. Al finalizar una tarea real, aquí se publicará un resumen técnico autorizado con problema, solución y validación.",
    progress: [
      {
        at: "2026-11-20T08:30:00-06:00",
        stage: "Solicitud recibida",
        note: "Registro inicial de ejemplo.",
      },
      {
        at: "2026-11-20T08:55:00-06:00",
        stage: "Finalizado",
        note: "Resumen disponible para consulta.",
      },
    ],
  },
  {
    id: "preview-archived-01",
    publishedAt: "2026-11-19T15:00:00-06:00",
    status: "completed",
    category: "UI / UX",
    title: "Ejemplo archivado (DEMO)",
    summary: "Solo prueba el contador de días anteriores.",
    description: "No es una publicación real.",
  },
];
