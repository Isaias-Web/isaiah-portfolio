# Recent Activity: publicación segura

## Comportamiento

- El frontend consulta GET /api/activity al cargar, cada 45 segundos y cuando la pestaña vuelve al primer plano.
- La API devuelve solo entradas del día en America/Mexico_City, ordenadas de nuevas a antiguas, y un contador de entradas anteriores.
- La notificación aparece dentro de la página cuando existe una entrada nueva no vista en ese navegador. No es una notificación del sistema operativo ni necesita permisos push.
- «Leer más» abre el panel inferior y expande la entrada. «×» descarta el aviso; «trabajando...» abre manualmente el listado.
- Los IDs vistos se recuerdan con localStorage; si está bloqueado, el contenido sigue disponible.
- En producción no hay contenido ficticio. Los ejemplos solo se muestran en el entorno de desarrollo y previews Vercel.

## Publicación de una actividad real

1. Redactar un texto que no contenga datos de clientes, URLs internas, datos personales, capturas privadas, métricas reservadas, nombres de colaboradores ni código confidencial.
2. Verificar qué se hizo y cómo se validó. Si no hubo despliegue, indicar «auditoría», «prototipo» o «análisis» en lugar de atribuir una implementación.
3. Solicitar aprobación explícita para publicar.
4. En una rama de trabajo, añadir la entrada aprobada al arreglo activityEntries del archivo src/data/recentActivity.ts. Nunca agregar publicaciones públicas a previewActivityEntries.
5. Usar un ID único (por ejemplo build-2026-11-20-01) y una fecha ISO 8601 con desplazamiento correcto de CDMX (por ejemplo 2026-11-20T14:35:00-06:00). No inventar fechas ni resultados.
6. Completar los campos id, publishedAt, category, title, summary y description. Evitar texto excesivo.
7. Crear Pull Request; comprobar lint, tipos y build. Fusionar a main solo después de recibir autorización.
8. Vercel despliega main automáticamente. Una vez finalizado el deploy, los navegadores abiertos consultan la API aproximadamente cada 45 segundos.

Ejemplo ilustrativo (no publicar automáticamente):

    {
      id: "build-YYYY-MM-DD-01",
      publishedAt: "YYYY-MM-DDTHH:mm:ss-06:00",
      category: "FRONTEND",
      title: "Título del trabajo autorizado",
      summary: "Qué se consiguió, de manera verificable.",
      description: "Problema, solución y validación, sin detalles sensibles.",
    },

## Verificación y límites

- El botón se desactiva durante preloader y overlays de proyecto.
- El panel reutiliza useBodyScrollLock, SmoothScrollContext y GSAP.
- Botones móviles: 138 × 36 px. Escritorio: 190 × 56 px.
- El toast tiene ancho máximo de 340 px.
- La fecha del servidor se calcula en America/Mexico_City.
- No existe un endpoint público de escritura; las publicaciones solo pueden llegar mediante un cambio aprobado en el repositorio.
- Es una experiencia de **casi tiempo real** después del deploy, no notificaciones nativas de Windows ni WebSockets.
- No existe una página de historial. Solo se ve el contador de entradas anteriores.
