# Protocolo multi-chat: publicaciones de actividad del portfolio

## Propósito y fuente de verdad

El portfolio público es https://isaiasfrutos.dev y su repositorio es Isaias-Web/isaiah-portfolio.
Los proyectos, chats y empresas de origen NO son el almacén público.
La fuente pública autorizada es el array activityEntries de src/data/recentActivity.ts.
Antes de registrar algo, lee:
- AGENTS.md (reglas generales de trabajo en el repositorio).
- docs/RECENT_ACTIVITY_PUBLISHING.md (reglas de publicación, estados y privacidad).
- src/data/recentActivity.ts (IDs actuales y modelo de datos).

Este procedimiento se aplica aunque el trabajo original ocurra en otro chat, otro proyecto ChatGPT, Codex o con otra empresa.

## Acciones explícitas desde cualquier chat

**A. PRE-REGISTRAR**
"Registra en mi portfolio esta solicitud aprobada, sin detalles confidenciales: [descripción general]".
- Resumir objetivo genérico y comprobable, sin identificar al cliente.
- Generar ID estable y único, status in_progress, publishedAt real y, si corresponde, etapa Solicitud recibida.
- No agregar description a entradas in_progress. En el sitio son tarjetas grises, sin acordeón.

**B. ACTUALIZAR**
"Publica un avance real de [ID o título]: [qué se completó y cómo se validó]".
- Localizar el mismo ID y revisar cuál fue el último paso publicado.
- Agregar al progress solo etapas comprobadas y actualizar updatedAt con la hora de CDMX.
- Mantener status in_progress y sin description mientras siga abierto.

**C. FINALIZAR**
"Cierra y publica en mi portfolio [ID o título]. Ya terminamos y verificamos: [resultado]".
- Conservar ID y fecha de origen; cambiar status a completed y actualizar updatedAt.
- Revisar summary y agregar description: problema, solución y validación, sin datos confidenciales.
- Agregar etapa de cierre solo si se verificó la finalización.

**D. SOLO BORRADOR**
"Prepara el texto de actividad sin publicarlo".
- Entregar propuesta sin modificar GitHub ni Vercel.

## Ejecución en GitHub / Codex

1. Confirmar autorización explícita para publicar el registro concreto o cerrarlo. Una petición genérica de trabajo no autoriza publicación automática.
2. Abrir el repositorio del portfolio y localizar el registro por ID. Si es nuevo, comprobar que no exista duplicado. No publicar nombres de clientes, URLs internas, credenciales, datos personales ni métricas privadas.
3. Modificar únicamente el array activityEntries de src/data/recentActivity.ts en una rama nueva. No cambiar previewActivityEntries.
4. Ejecutar npm run lint, npx tsc --noEmit, las pruebas pertinentes y npm run build (o verificar los resultados CI).
5. Crear PR, revisar diff y confirmar privacidad. Fusionar a main solo con autorización de despliegue y pruebas correctas.
6. Verificar Vercel para el commit fusionado antes de declarar éxito en producción.
7. Informar: ID, categoría, estado, resumen público, PR, producción, CI/Vercel y pendientes.

## Funcionamiento existente

- GET /api/activity recibe publicaciones ya desplegadas. Frontend consulta cada 45 segundos y al volver a la pestaña.
- La tarjeta es visible 24 horas exactas desde updatedAt, o publishedAt si no hubo avances.
- Aviso de nueva actividad visible en la primera hora después de publicar, salvo que ya se haya visto en el navegador.
- Para in_progress: aviso de solicitud/avance y tarjeta gris no desplegable.
- Para completed: aviso de trabajo finalizado y descripción desplegable.
- Contador histórico: solo trabajos completados expirados, no solicitudes abiertas.
- El horario trabajando... / 😴 zzz... depende del reloj CDMX, no de la presencia real.
- No se generan pasos ni conclusiones ficticios con temporizadores.
- No existe publicación instantánea desde cualquier chat ni API pública de escritura: se requiere PR y despliegue.

## Varios proyectos y empresas

- Mantener un Proyecto ChatGPT por cliente o área privada, con archivos y contexto aislados.
- Conservar un proyecto central «Portfolio / Public Activity» solo con el protocolo y textos ya autorizados para publicidad.
- Usar Codex en Isaias-Web/isaiah-portfolio para ejecutar los cambios aprobados; Codex debe leer AGENTS.md y este protocolo.
- No copiar chats completos de clientes ni mezclar información privada entre proyectos.
- Crear IDs por solicitud real, no por chat. Un trabajo que ocupe varios chats conserva su ID.
- Para trabajos simultáneos, mantener entradas y estados independientes.
