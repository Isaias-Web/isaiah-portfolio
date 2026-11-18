# Preview de referencia — Portfolio V2

**Última sincronización:** 18 de noviembre de 2026

**Producción de referencia:** `main` en el commit `2d4de80bca7df7acff72202640c8954adce5ee5c`.

Esta rama `preview/portfolio-completo-20261118` es una referencia visual y de comparación. Recibió los cambios de `main` mediante los PR #9, #11 y #13. Su única diferencia deliberada de contenido es este documento de referencia.

## Funcionalidades integradas

- SEO, semántica, HTML inicial y preloader visual independiente.
- Hero, Manifesto, WhoAmI, RightNow, ProjectsRail y OpenChannel.
- Información UIC, ingeniería asistida por IA y automatización, con editoriales y reveals reversibles.
- Ajustes responsive, títulos equilibrados y proyectos con brillo al hover.
- Cursor personalizado con indicación «CLICK PARA INTERACTUAR».
- Formulario Web3Forms con notificación temporal de éxito tras confirmación del proveedor.
- **PR #8:** Perfil actual unificado, segundo artículo invertido en escritorio, tarjetas con efecto hover y eliminación completa del bloque inferior redundante de automatización.
- **PR #10:** Next.js 16.4.6 y correcciones de seguridad, optimizaciones medidas de cursor, Manifesto y RightNow, accesibilidad de WhatsApp, inventario de imágenes, pruebas y evidencias de Lighthouse.
- **PR #12:** Seis WebP optimizados, referencias actualizadas en Hero y paneles/casos; se mantienen originales hasta una revisión de limpieza posterior.

## Validación y precauciones

- La rama fue creada para revisar la versión equivalente a la publicación, no para representar un futuro cambio no fusionado.
- El envío de Web3Forms requiere `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` en el entorno que se compila (Preview o Production). Se confirmó la recepción de una consulta de prueba enviada desde una preview anterior. Eso **no** demuestra por sí mismo la activación en Production.
- Los estados de Vercel/GitHub no sustituyen pruebas reales de accesibilidad, Core Web Vitals, certificados HTTPS y navegación en distintos dispositivos.
- Para actualizar esta referencia a futuro: fusionar los nuevos PR en `main`, sincronizar `main` hacia esta rama de preview por un PR orientado **a preview** (nunca al revés) y actualizar aquí el commit de referencia. No modificar producción desde la preview.
