# Auditoría técnica inicial — 14 de noviembre de 2026

## Alcance

La primera pasada fue una revisión estática parcial del repositorio `Isaias-Web/isaiah-portfolio`, partiendo de `main`. La continuación documentada abajo usa `chore/technical-audit-seo` y el PR #1, e incluye validaciones automatizadas locales. No constituye una auditoría exhaustiva del sitio, de seguridad ni de Core Web Vitals. Las pruebas en navegador siguen pendientes.

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

## Continuación de la auditoría — 14 de noviembre de 2026

### Base verificada antes de editar

- Checkout inicial: rama local `work`, limpia, en `232347489ffe692c487f8868f1fae1d63e50152d`, igual a `origin/main`.
- Se consultó el PR [#1](https://github.com/Isaias-Web/isaiah-portfolio/pull/1): abierto, borrador, base `main`, head `chore/technical-audit-seo` en `dbc76c1722dda416fd915c18f593b0003fcdb6e5`.
- Se descargó esa rama y se cambió a la rama local `chore/technical-audit-seo`, al mismo commit. Se leyeron `AGENTS.md`, `README.md` y este informe antes de editar archivos.
- Se revisaron los nueve archivos del diff del PR y su historial. Metadata, canonical, idioma, robots, sitemap, CI, README y las sustituciones en Hero/OpenChannel ya estaban implementados; no se duplicaron.
- Entorno local: Node.js `v24.22.1`, npm `11.9.0`, dependencias ya instaladas. No se ejecutó `npm ci` ni se modificaron dependencias o lockfile. La CI existente usa Node.js 22; estos resultados locales no sustituyen esa ejecución.

### Comandos y resultados

| Comando | Antes de los ajustes | Después de los ajustes |
| --- | --- | --- |
| `npm run lint` | Código 1: 2 errores, 23 advertencias | Código 1: 2 errores, 22 advertencias |
| `npx tsc --noEmit` | Código 0 | Código 0 |
| `npm run build` | Código 0 | Código 0 |
| `git diff --check` | Árbol inicial limpio | Código 0 |

El build de Next.js 16.2.1 genera `/`, `/_not-found`, `/robots.txt` y `/sitemap.xml`. Que compile no significa que ESLint pase: `next build` no ejecuta el lint de esta CI. El paso ESLint continúa bloqueando la secuencia lint → TypeScript → build de GitHub Actions.

También se ejecutaron:

- `git status --short --branch`, `git branch -avv`, `git remote -v`, `git log` y `git diff origin/main...HEAD` para comprobar checkout y cambios existentes.
- `git fetch origin chore/technical-audit-seo`: obtuvo `FETCH_HEAD`, pero el checkout solo tenía configurada la referencia remota de `main`. El primer intento de `git switch --track` falló por referencia inexistente. Se descargó explícitamente `refs/heads/chore/technical-audit-seo:refs/remotes/origin/chore/technical-audit-seo`; el segundo intento con `--track` falló por la configuración de seguimiento. `git switch -c chore/technical-audit-seo refs/remotes/origin/chore/technical-audit-seo` creó y seleccionó correctamente la rama local. No se cambió la configuración remota.
- `node --version`, `npm --version`, lectura con `cat` y búsquedas con `rg` de instrucciones, usos de hooks, imágenes y dominios.
- Inspección con Python del HTML, robots y sitemap generados en `.next/server/app/`, sin consultar ni modificar producción.

Los logs completos de las dos ejecuciones de cada comprobación se guardaron en `/workspace/work/technical-audit/` (`lint-before.log`, `lint-after.log`, `types-before.log`, `types-after.log`, `build-before.log`, `build-after.log`), fuera del repositorio.

### Errores investigados y cambios diferidos por el punto 6 del encargo

**`src/components/projects/overlay/ProjectOverlayHost.tsx:57` — `react-hooks/set-state-in-effect`.** El efecto copia `activeProject` a `displayedProject` y activa `pendingFadeIn` al abrir por primera vez, provocando otro render tras el commit. `displayedProject` también retiene el proyecto anterior mientras GSAP ejecuta la salida de 0.22 s; al completar, se sustituye el contenido y se anima la entrada de 0.28 s después de dos `requestAnimationFrame`, reiniciando el scroll interno. Sustituir todo por `activeProject` o remontar el componente alteraría esa secuencia y podría reiniciar la animación del shell o los bloqueos de scroll.

Además, los `return` dentro de los callbacks de `requestAnimationFrame` no son el cleanup del efecto: React no los ejecuta al desmontar. Debe revisarse la cancelación de esos frames y del tween de entrada. El tween de salida sí se mata en su cleanup, pero el indicador `isTransitioningRef` solo se restablece al terminar la entrada; una interrupción merece una prueba específica. Son riesgos observados en la lectura del código, no fallos reproducidos en navegador.

**Decisión:** no modificar automáticamente este flujo. La corrección debe coordinar selección y fases de transición, conservar los tiempos y validar primera apertura, navegación entre los siete casos, navegación rápida, cierre durante una transición y reapertura del mismo u otro proyecto. No se introdujeron timers, microtareas ni supresiones para eludir ESLint.

**`src/hooks/useProjectsRail.ts:17` — `react-hooks/set-state-in-effect`.** El diagnóstico señala el `setRailTween(null)` síncrono cuando faltan los nodos. También hay publicación del tween desde el callback síncrono de `gsap.context` y reseteo de estado en cleanup. El estado provoca el render que entrega `containerAnimation` a los siete paneles, cuyos efectos inicialmente retornan si no tienen tween. Quitar el setter señalado o convertir el estado directamente en un ref no resuelve por sí solo esa coordinación: los paneles necesitan recibir el tween vivo para configurar sus reveals.

**Decisión:** no alterar automáticamente la integración. Una corrección debe mantener el orden de creación y consumo del tween, `ctx.revert()`, pin, `scrub: 1`, cálculo de anchura e invalidación en refresh. Requiere probar resize, montaje/desmontaje y Strict Mode, los siete reveals, continuidad del scroll horizontal y posición tras cerrar el overlay, con Lenis activo.

### Inventario de las 23 advertencias iniciales

**21 × `@next/next/no-img-element` (pendientes).** Una advertencia por archivo, con estas ubicaciones relativas a `src/components/projects/`:

| Proyecto | Hero (línea 8) | Feature (línea 15) | Panel (línea 29) |
| --- | --- | --- | --- |
| Hookah GT | `case-studies/hookahgt/HookahGtHero.tsx` | `case-studies/hookahgt/HookahGtFeature.tsx` | `panels/ProjectPanelHookahGt.tsx` |
| Hookah Partner | `case-studies/hookahpartner/HookahPartnerHero.tsx` | `case-studies/hookahpartner/HookahPartnerFeature.tsx` | `panels/ProjectPanelHookahPartner.tsx` |
| Onda | `case-studies/onda/OndaHero.tsx` | `case-studies/onda/OndaFeature.tsx` | `panels/ProjectPanelOnda.tsx` |
| Sectra Vision | `case-studies/sectravision/SectraVisionHero.tsx` | `case-studies/sectravision/SectraVisionFeature.tsx` | `panels/ProjectPanelSectraVision.tsx` |
| TradeMate | `case-studies/trademate/TradeMateHero.tsx` | `case-studies/trademate/TradeMateFeature.tsx` | `panels/ProjectPanelTradeMate.tsx` |
| Tryfum | `case-studies/tryfum/TryfumHero.tsx` | `case-studies/tryfum/TryfumFeature.tsx` | `panels/ProjectPanelTryFum.tsx` |
| VapeMate | `case-studies/vapemate/VapeMateHero.tsx` | `case-studies/vapemate/VapeMateFeature.tsx` | `panels/ProjectPanelVapeMate.tsx` |

Los siete assets de imagen referenciados existen en `public/images/`. Las imágenes de Hero y panel están dentro de capas absolutas con recorte, opacidad y escala; las de Feature usan una caja de aspecto fijo. Migrarlas a `next/image` exige decidir `fill` o dimensiones, `sizes` y estrategia de carga; puede cambiar posicionamiento, nitidez, solicitudes y aparición durante el desplazamiento. No se migraron ni se ocultaron advertencias. Antes de aplicarlo, comparar móvil/escritorio, recortes y escalas, apertura del overlay, desplazamiento del rail y carga con red lenta. La advertencia expresa un riesgo de rendimiento; no demuestra una regresión medida de LCP.

**1 × `react-hooks/exhaustive-deps` en `ProjectDetailShell.tsx:50` (pendiente).** El listener de Escape se registra con `[]`, capturando el primer `handleRequestClose`, `isClosing` y `onClose`. Hay riesgo de usar un callback antiguo y de no respetar el estado de cierre en pulsaciones repetidas. Una propuesta es estabilizar el handler con `useCallback` y declarar las dependencias del listener. Como afecta la reversa de la timeline y la devolución del scroll al cerrar, se difiere hasta probar Escape repetido, botón, backdrop, cierre durante apertura y callbacks actualizados.

**1 × `react-hooks/exhaustive-deps` en `usePreloader.ts:91` (corregida).** El spread `...deps` impedía analizar estáticamente las dependencias. La búsqueda de usos encontró un único consumidor, `Preloader`, que siempre enviaba `[svgWidth]`. Se sustituyó ese parámetro genérico por `svgWidth: number` y se enumeró explícitamente en el mismo lugar del array. Antes y después, React compara exactamente `[rootRef, wavePathRef, lineRef, setProgress, onComplete, svgWidth]`; se conserva el reinicio al cambiar el ancho y no se modifican la timeline, callbacks, cleanup, markup ni estilos de la animación. No se cambió la identidad de `onComplete` ni la política de resize.

### SEO comprobado en código y artefactos locales

| Elemento | Resultado |
| --- | --- |
| Metadata | Título y descripción específicos, presentes en el HTML generado; sin textos de la plantilla |
| Canonical | `metadataBase` usa `https://isaiasfrutos.dev`; `canonical: "/"` genera `https://isaiasfrutos.dev` |
| Idioma | `<html lang="es-MX">`; Open Graph usa `es_MX`, formato propio de OG |
| Open Graph y Twitter | Tipo `website`, URL del dominio canónico, título y descripción coherentes; Twitter `summary`; sin imagen inventada |
| Robots | Meta `index, follow`; `/robots.txt` permite `/` a `*` y declara host y sitemap del dominio canónico |
| Sitemap | Una URL, `https://isaiasfrutos.dev`, frecuencia mensual y prioridad 1; XML generado correctamente |
| Dominio antiguo | Quedaban textos en Preloader, Manifesto y ProjectDetailShell; sustituidos. La búsqueda posterior no encuentra `isaiasfrutosweb.site` en `src/` |
| Enlaces | Se conservan enlaces legítimos a proyectos y redes; `public/cv-isaias-frutos.pdf` existe |

**Hallazgo SEO confirmado:** `.next/server/app/index.html` contiene los metadatos, pero no un elemento `<main>`. En `page.tsx`, `loadingComplete` comienza en `false` y las secciones solo se montan tras completar el preloader cliente (`ssr: false`). El contenido principal depende de JavaScript y de la finalización de la animación. Se debe evaluar renderizar las secciones desde el inicio manteniendo la capa del preloader, pero eso afecta medición y montaje de GSAP, Lenis y rail: no se implementó según el punto 6. No se concluye que todos los buscadores fallen al indexar; no se probó su renderizado diferido.

No se verificaron DNS, redirecciones HTTP del dominio `www`, cabeceras `X-Robots-Tag` de Vercel ni contenido servido en producción/preview. El 308 mencionado en README sigue siendo una afirmación previa pendiente de comprobación en el despliegue. Los resultados anteriores proceden del build local. No se midieron Lighthouse ni Core Web Vitals y no se ejecutaron pruebas de navegador.

### Archivos modificados en esta continuación

| Archivo | Cambio aplicado |
| --- | --- |
| `src/hooks/usePreloader.ts` | Parámetro y dependencia explícitos `svgWidth`; elimina una advertencia sin cambiar las condiciones de ejecución |
| `src/components/Preloader.tsx` | Consumidor del parámetro explícito y texto del dominio actualizado |
| `src/components/projects/overlay/ProjectDetailShell.tsx` | Solo texto del dominio actualizado; listener y animaciones intactos |
| `src/sections/Manifesto.tsx` | Solo texto del dominio actualizado |
| `docs/TECHNICAL_AUDIT.md` | Alcance actualizado, evidencias, resultados, inventario y decisiones de esta continuación |

Se añadieron saltos de línea finales donde faltaban. No se modificaron reglas de ESLint, dependencias, CSS, configuración de GSAP/Lenis, lógica del scroll horizontal, metadata ya correcta, workflow ni configuración de Vercel.

### Estado para revisión

Los ajustes seguros quedan como diff local sobre el head del PR #1. No se hizo commit, push, publicación, merge, cambio de `main` ni despliegue manual. **La auditoría no deja el lint en verde:** siguen dos errores y 22 advertencias. Por la instrucción del usuario de reportar y no implementar automáticamente cambios que necesiten navegador, las correcciones del overlay, rail, cierre e imágenes quedan propuestas para una siguiente revisión con esas pruebas. No aprobar producción basándose solo en TypeScript y build.
