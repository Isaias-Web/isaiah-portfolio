# Recent Activity: solicitudes, avances y reportes

## Comportamiento del sitio

- El botón naranja muestra "trabajando..." de las 08:00 a las 19:59 y "😴 zzz..." de las 20:00 a las 07:59, hora de America/Mexico_City. Es solo una etiqueta por horario; **no indica presencia laboral comprobada**.
- El frontend consulta GET /api/activity al entrar, cada 45 segundos y cuando la pestaña vuelve al primer plano.
- La API muestra únicamente registros (en curso o completados) con una actualización publicada en las últimas 24 horas exactas, sin depender del cambio de día. El período se cuenta desde updatedAt, o publishedAt si nunca hubo avances. Una solicitud antigua también desaparece al vencer la ventana; una actualización real aprobada inicia una nueva ventana de 24 horas. El contador conserva únicamente los trabajos finalizados anteriores, no solicitudes vencidas.
- Una notificación dentro de la página aparece si una etapa **real y aprobada** fue publicada durante la última hora y no se ha visto en ese navegador. No es un push nativo de Windows.
- Una notificación de una solicitud abierta dice "Ver avance". Abre el módulo, pero su tarjeta queda deshabilitada para expandir. Muestra hasta tres avances reales en texto tenue y conserva la misma identidad visual.
- Una notificación de trabajo finalizado dice "Leer resumen". Abre el módulo y despliega el resumen técnico.
- Los avisos nuevos tienen un retardo de presentación de 900 ms después de leer el feed, se descartan automáticamente a los 8.5 segundos y se recuerdan por ID + updatedAt + estado mediante localStorage.
- No se generan etapas, conclusiones o avances con temporizadores. La única animación en loop es el indicador de puntos del botón de horario laboral.

## Forma de publicación 1: preregistro de solicitud

1. Registrar una solicitud que el titular haya **aprobado publicar**, sin datos privados ni identidad de terceros.
2. Añadirla al arreglo activityEntries del archivo src/data/recentActivity.ts con un ID único y status: "in_progress".
3. Completar publishedAt, category, title, summary y progress: [{ at, stage, note }]. La descripción técnica **no existe todavía**.
4. Si surge un avance real (por ejemplo revisión, investigación, desarrollo o validación), añadir un elemento a progress **después de que ocurrió** y actualizar updatedAt a la fecha/hora real.
5. En cada actualización, abrir revisión de código y aprobar su publicación en GitHub. Vercel actualiza la web después del despliegue; el frontend lo detectará al sondear la API.
6. La ficha permanece visible y no muestra botón de expansión mientras registre actividad aprobada dentro de las últimas 24 horas. Si pasan 24 horas sin un nuevo avance, desaparece de la vista pública aunque todavía esté abierta.

Ejemplo de entrada **ficticia de documentación, no publicarla**:

    {
      id: "request-2026-11-20-01",
      publishedAt: "2026-11-20T09:00:00-06:00",
      updatedAt: "2026-11-20T09:20:00-06:00",
      status: "in_progress",
      category: "WEB ENGINEERING",
      title: "Revisión técnica (EJEMPLO)",
      summary: "Análisis de requisitos y soluciones posibles.",
      progress: [
        { at: "2026-11-20T09:00:00-06:00", stage: "Solicitud recibida", note: "Objetivo registrado." },
        { at: "2026-11-20T09:20:00-06:00", stage: "Revisión", note: "Revisión del alcance." },
      ],
    }

## Forma de publicación 2: cierre de la misma solicitud

1. Solo cuando realmente termine el trabajo, cambiar **el mismo ID**, nunca crear una entrada duplicada.
2. Cambiar status a "completed", actualizar updatedAt, ajustar summary al resultado real y agregar **description** con problema, implementación y validación, sin información sensible.
3. Añadir un último progress que marque la conclusión real si se desea.
4. Solicitar aprobación expresa del resumen y fusionar la edición a main después de las verificaciones.
5. Al desplegarse, la misma ficha deja de estar atenuada, habilita su acordeón y la notificación ofrece "Leer resumen".

El esquema TypeScript exige description para status "completed" y la prohíbe para "in_progress".

## Reglas de seguridad y publicación

- No publicar datos personales, URLs internas, accesos, credenciales, código privado, métricas reservadas, nombres de clientes o infraestructura reconocible.
- No declarar implementaciones si solo hubo auditoría o propuesta; no declarar pruebas o resultados sin verificarlos.
- Cada etapa se registra porque ocurrió, **nunca para simular que un sistema está trabajando**.
- No hay escritura pública ni tokens en el navegador: las publicaciones requieren un cambio autorizado en GitHub y deploy de Vercel.
- Los ejemplos solo existen en desarrollo y en previews de Vercel. Producción empieza sin datos hasta aprobar la primera publicación real.
- Decir en ChatGPT «empecemos» o «terminamos» no publica por sí mismo. Es necesario autorizar el registro, subir el cambio al repositorio y completar el despliegue antes de que aparezca la notificación.
- La leyenda inferior del panel comunica que los registros representan actividad de las últimas 24 horas; al vencer su ventana dejan de mostrarse.
- El preloader, los overlays de proyectos, Lenis, GSAP y el lock de scroll siguen utilizando los controles actuales.
- Botones móviles: 138 × 36 px. Botones escritorio: 190 × 56 px. Toast de 340 px máximo.
