export type ActivityProgress = {
  at: string; // ISO 8601 con zona horaria
  stage: string; // Etapa real, no generada con temporizadores
  note: string; // Breve avance publicable y verificable
};

type ActivityBase = {
  id: string;
  publishedAt: string; // Registro inicial
  updatedAt?: string; // Actualizar al registrar un avance o cerrar el trabajo
  category: string;
  title: string;
  summary: string;
  // Solo etapas que efectivamente se hayan realizado y autorizado.
  progress?: ActivityProgress[];
};

export type ActivityEntry =
  | (ActivityBase & {
      status: "in_progress";
      description?: never; // No publicar resumen antes de finalizar
    })
  | (ActivityBase & {
      status: "completed";
      description: string; // Obligatorio para permitir el acordeón final
    });

// Publicaciones aprobadas. Nunca incluir datos privados, URLs internas,
// información de clientes o procesos que no se hayan realizado.
export const activityEntries: ActivityEntry[] = [
  {
    id: "og-social-card-2026-11-20",
    publishedAt: "2026-11-20T14:06:34-06:00",
    updatedAt: "2026-11-20T14:43:41-06:00",
    status: "completed",
    category: "SEO / FRONTEND",
    title: "Integración de vista previa en redes sociales",
    summary: "Vista previa Open Graph corregida y comprobada en WhatsApp.",
    description:
      "Se identificó que el enlace del portfolio se compartía inicialmente con un bloque de color, sin el arte de presentación. Se sustituyó la generación anterior por una imagen JPEG de 1200 × 630 píxeles servida directamente desde una ruta versionada, y se actualizaron las etiquetas Open Graph y Twitter. Las verificaciones técnicas y el despliegue se realizaron correctamente. Finalmente, el propietario comprobó en WhatsApp que la tarjeta mostraba la composición gráfica y el contenido esperado.",
    progress: [
      {
        at: "2026-11-20T14:06:34-06:00",
        stage: "Solicitud recibida",
        note: "Se inició la revisión del enlace compartido y de las etiquetas sociales existentes.",
      },
      {
        at: "2026-11-20T14:12:58-06:00",
        stage: "Integración inicial",
        note: "Los metadatos se desplegaron, pero faltaba comprobar el resultado visual en WhatsApp.",
      },
      {
        at: "2026-11-20T14:25:32-06:00",
        stage: "Corrección desplegada",
        note: "Se sustituyó el renderizado anterior por una imagen JPEG directa y se actualizó la ruta pública.",
      },
      {
        at: "2026-11-20T14:43:41-06:00",
        stage: "Validación visual aprobada",
        note: "El propietario verificó en WhatsApp que el enlace ya muestra correctamente la imagen social.",
      },
    ],
  },
  {
    id: "activity-review-2026-11-20",
    publishedAt: "2026-11-20T13:27:23-06:00",
    updatedAt: "2026-11-20T13:41:11-06:00",
    status: "completed",
    category: "WEB ENGINEERING",
    title: "Revisión del sistema de actividad",
    summary: "Módulo de notificaciones y seguimiento validado en producción.",
    description:
      "Se implementó y publicó un sistema de actividad para el portfolio con solicitudes en proceso, avances registrados, resúmenes técnicos de trabajos finalizados y notificaciones dentro de la página. La API consulta y presenta registros de las últimas 24 horas. La implementación pasó las verificaciones automáticas de ESLint, TypeScript, pruebas existentes y compilación, y se confirmó manualmente el funcionamiento general del módulo en producción. La ficha conserva únicamente una descripción pública sin datos confidenciales.",
    progress: [
      {
        at: "2026-11-20T13:27:23-06:00",
        stage: "Solicitud recibida",
        note: "Se inició la revisión del módulo y de la publicación de actividades.",
      },
      {
        at: "2026-11-20T13:41:11-06:00",
        stage: "Revisión completada",
        note: "Se confirmó el funcionamiento del módulo en producción.",
      },
    ],
  },
];

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
    publishedAt: "2026-11-18T15:00:00-06:00",
    status: "completed",
    category: "UI / UX",
    title: "Ejemplo archivado (DEMO)",
    summary: "Solo prueba el contador de días anteriores.",
    description: "No es una publicación real.",
  },
];
