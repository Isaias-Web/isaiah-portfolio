# Auditoría técnica inicial — 14 de noviembre de 2026

## Alcance

Revisión estática parcial del repositorio `Isaias-Web/isaiah-portfolio`, sobre la rama `main`. No constituye una auditoría exhaustiva del sitio, de seguridad ni de Core Web Vitals. Todavía deben ejecutarse las validaciones automatizadas y pruebas en navegador.

## Correcciones propuestas en este Pull Request

- Sustituir metadatos genéricos por título, descripción, canonical y Open Graph del dominio `isaiasfrutos.dev`.
- Declarar `es-MX` como idioma principal del HTML.
- Crear `/robots.txt` y `/sitemap.xml` con el dominio canónico.
- Sustituir referencias visibles del antiguo `isaiasfrutosweb.site` en Hero y OpenChannel.
- Reemplazar README de plantilla con instrucciones y flujo de publicación.
- Incorporar CI básica: lint, TypeScript y build.

## Hallazgos que requieren revisión adicional

1. **Renderizado para buscadores:** `src/app/page.tsx` es un Client Component que solo monta las secciones cuando `loadingComplete` es true. Comprobar HTML inicial, accesibilidad del contenido para rastreadores y la experiencia sin JavaScript antes de rediseñar el preloader.
2. **Accesibilidad:** `src/app/globals.css` oculta el cursor de forma global a partir de 768px. Auditar navegación por teclado, estado de foco, `prefers-reduced-motion` y dispositivos que no sean puntero fino.
3. **Rendimiento:** medir LCP, INP y CLS reales; el hero usa imagen de fondo y animaciones GSAP. Verificar peso de assets, carga de fuentes y uso de `will-change`.
4. **Imagen para compartir:** se configuró una tarjeta genérica (`summary`) sin asociar imagen inexistente; diseñar y validar una imagen Open Graph antes de asignar `og:image`.
5. **SEO semántico:** revisar headings, enlaces internos, alt de imágenes, enlaces a redes, PDFs existentes y datos estructurados (solo si son verificables).
6. **Despliegues:** verificar que los checks pasen, que el preview de Vercel renderice correctamente y que `main` continúe siendo Production.
7. **Contenido:** corroborar que las tecnologías y afirmaciones de experiencia correspondan a proyectos demostrables.

## Comprobación manual sugerida

- `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- Abrir el Preview Deployment en móvil y escritorio.
- Inspeccionar `view-source:` y contenido disponible para rastreo.
- Abrir `/robots.txt` y `/sitemap.xml`.
- Revisar `<title>`, description, canonical, `og:*`, `twitter:*` y `lang`.
- Revisar botones y enlaces con teclado; probar preferencias de movimiento reducido.
- Ejecutar Lighthouse y comprobar Web Vitals en producción cuando se publique.

## Regla de publicación

No fusionar a `main` hasta verificar los checks y revisar el preview. No se modifica el diseño ni la lógica del preloader en esta primera pasada.
