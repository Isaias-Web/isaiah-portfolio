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

Al terminar la primera continuación, los ajustes seguros quedaron como diff local sobre el head del PR #1, sin commit ni push en esa sesión. **La auditoría no deja el lint en verde:** siguen dos errores y 22 advertencias. Por la instrucción del usuario de reportar y no implementar automáticamente cambios que necesiten navegador, las correcciones del overlay, rail, cierre e imágenes quedan propuestas para una siguiente revisión con esas pruebas. No aprobar producción basándose solo en TypeScript y build.

## Plan técnico para aprobación — segunda continuación

### Persistencia y alcance

Se revisaron primero `git status --short --branch` y `git diff`: estaban exactamente los cinco archivos de la continuación anterior. Se conservaron y guardaron en `7c45706` (`chore: preserve audit findings and safe SEO fixes`). El push normal a `chore/technical-audit-seo` tuvo éxito, avanzando desde `dbc76c1` y actualizando el PR #1. No fue necesario forzar ni cambiar permisos. En esta segunda continuación solo se modifica documentación; no se implementa el plan siguiente ni se cambian componentes o arquitectura.

### Causa del HTML inicial incompleto

`page.tsx` es cliente, pero eso por sí solo no impide que Next prerenderice su markup. La causa concreta es `{loadingComplete && <main>…</main>}` con estado inicial `false`. El preloader se importa con `ssr: false`; su fallback es una capa oscura fija. Por tanto, el servidor genera metadata y shell, pero ninguna de las seis secciones de `main`. Sin JavaScript tampoco se ejecuta el callback que libera el contenido.

Al montar más tarde las secciones, sus efectos arrancan entonces: Hero crea y reproduce inmediatamente `introTl`; Manifesto y WhoAmI crean ScrollTriggers con pin; ProjectsRail crea el tween horizontal que consumen los reveals. Renderizar `main` incondicionalmente sin coordinar esos efectos adelantaría su arranque durante los aproximadamente 3.55 s de la timeline del preloader (puede reiniciarse al cambiar `svgWidth`). Esa sustitución aislada no conserva la experiencia.

### Propuesta recomendada, aún sin implementar

1. **HTML permanente:** mantener `<main>` con Hero, Manifesto, WhoAmI, ProjectsRail, RightNow y OpenChannel en el render inicial, en el mismo orden y sin `key` que provoque remontaje al terminar la carga. No hace falta convertir toda la página a Server Component para conseguir SSR. Una separación servidor/cliente más amplia queda fuera de esta corrección.
2. **Capa visual independiente:** conservar el preloader fijo y su timeline actual. Su finalización solo retira la capa y cambia una señal explícita `introReady`; nunca determina la existencia de `main`. Usar un callback estable de finalización para que renders del coordinador no reinicien `usePreloader`. Mantener las duraciones, easing y dependencia de ancho actuales; revisar resize en una tarea separada.
3. **Arranque controlado:** pasar la señal a Hero y a los hooks de scroll (incluidos sus consumidores en Manifesto, WhoAmI y ProjectsRail). Antes de `introReady`, no crear timelines, pins ni reveals que consuman su animación bajo la capa. Al cambiar a listo, crear los contextos y reproducir la intro una sola vez. Los efectos deben depender explícitamente de la señal y devolver `ctx.revert()`; no llamar hooks condicionalmente. Mantener el SSR visible por defecto, sin clases globales `opacity: 0`, `hidden` o `visibility: hidden` en el contenido.
4. **Medición y orden:** establecer una barrera de preparación: fuentes (`document.fonts.ready`) e imágenes que determinen geometría; crear contextos en orden de documento y refrescar ScrollTrigger una vez que todos los pins y el tween horizontal estén registrados. Coordinarlo explícitamente, sin asumir que un efecto del padre corre antes que los hijos. Cancelar la preparación al desmontar. No esperar indefinidamente por recursos fallidos y no usar timers para esconder errores de Hooks. Conservar fórmulas de anchura, pin y scrub de cada sección.
5. **Scroll y entrada durante la capa:** integrar la fase de carga con `SmoothScrollContext` y el bloqueo del documento; comprobar que la instancia Lenis, creada en un efecto distinto, recibe el estado inicial de pausa. Evitar que un overlay cerrado libere accidentalmente una pausa del preloader. De ser necesario, diseñar propietarios independientes del bloqueo antes de cambiar ese contexto; no reutilizar ciegamente el booleano actual. Mantener la posición inicial y el retorno del scroll del overlay.
6. **Accesibilidad y fallos:** durante la carga hidratada, impedir foco y clics bajo la capa mediante `inert`, limitado a esa fase y retirado al terminar. No emitir `inert` ni `aria-hidden` de forma permanente en el HTML del servidor. Hacer que el fallback oscuro de la importación dinámica no tape el contenido sin JavaScript (capa activada solo tras hidratación, o fallback exclusivamente cliente). Definir una salida de error que retire la capa y deje contenido visible si falla la importación o la preparación. El modo sin JavaScript debe mostrar contenido y scroll nativo; no prometer funcionalidad de overlays interactivos sin JS.

Archivos previstos para una implementación aprobada: `src/app/page.tsx`, consumidores/secciones y hooks de animación indicados arriba; posiblemente `SmoothScrollContext.tsx`, `SmoothScroll.tsx` y `useBodyScrollLock.ts` si la coordinación de bloqueo lo requiere. No se necesitan cambios SEO, Vercel, dependencias ni estilos editoriales. Los cambios de SSR y los arreglos de overlay/rail deben dividirse en commits revisables para identificar regresiones.

### Clasificación de los dos errores y las 22 advertencias actuales

| Grupo | Corrección propuesta | Riesgo y validación |
| --- | --- | --- |
| Overlay: 1 error `set-state-in-effect` | Coordinar selección inicial en el evento de apertura y fases de transición; reservar el cambio de contenido de navegación para el callback de salida GSAP. Cancelar ambos RAF y los tweens desde el cleanup real del efecto; restablecer la transición en cancelación | Requiere navegador: no derivar siempre `displayedProject` de la prop ni remontar el shell por proyecto. Conservar primera apertura, reapertura y fades de 0.22/0.28 s |
| Rail: 1 error `set-state-in-effect` | Prototipo de un coordinador imperativo de tween y reveals: registrar paneles por ref, crear primero el tween y después sus ScrollTriggers dentro de contextos con limpieza conjunta; retirar su transporte por estado React | Requiere aprobación y navegador: cambia coordinación interna. Preservar orden y cleanup de los siete paneles. No basta con borrar el setter de la rama nula; no publicar un ref durante render ni desplazar setters a un timer |
| Shell: 1 advertencia `exhaustive-deps` | `useCallback` con `[isClosing, onClose]` para `handleRequestClose`, y dependencia explícita del listener de Escape | Cambio pequeño sin intención de cambiar apariencia, pero corrige una captura obsoleta y por ello puede cambiar comportamiento. Probar Escape repetido, botón, backdrop y cierre durante apertura |
| Imágenes: 21 advertencias `no-img-element` | Migración por grupos (7 Hero, 7 Feature, 7 paneles), con `fill`/dimensiones y `sizes` adecuados a cada contenedor | Requiere comparación visual y de red: mantener cajas, recortes, opacidad y escala. No asignar prioridad a todas ni cambiar la carga sin medir |

El inventario completo de archivos y líneas está en la sección anterior. **No quedan diagnósticos cuya corrección pueda asegurarse como puramente equivalente sin pruebas funcionales o visuales.** La sustitución de `...deps` por `svgWidth`, ya incluida en `7c45706`, sí conserva exactamente las dependencias y no se repite. Corregir la dependencia de Escape es el candidato más acotado, pero no es una equivalencia estricta. No se desactivan reglas ni se editan componentes en esta fase.

### Secuencia de revisión y criterios de aceptación

1. Capturar el comportamiento actual en móvil y escritorio, incluyendo primera apertura y reapertura, antes de implementar. Probar también Strict Mode local.
2. Aprobar primero el contrato `introReady`, el tratamiento de errores/sin JS, el bloqueo de entrada y la coordinación de preparación. Implementar SSR y arranque sin mezclar la migración de imágenes.
3. Comprobar el HTML de la respuesta (sin depender del DOM hidratado): un `main`, texto de las seis secciones, headings y enlaces existentes; metadata intacta. Con JS desactivado, contenido legible sin capa negra bloqueante.
4. Con JS, verificar que no se vea contenido antes de la capa, que la intro Hero comience tras su salida y que no se repita por renders/resize. Revisar scroll temprano, restauración de posición, fuentes lentas, importación fallida y movimiento reducido.
5. Comprobar los pins de Manifesto/WhoAmI, los siete reveals del rail, resize/orientación, scroll horizontal y overlay (navegación rápida, cierre durante fade, Escape repetido y devolución de Lenis). No deben quedar RAF, listeners ni ScrollTriggers tras desmontar.
6. Abordar los arreglos de Hooks y después las imágenes en commits separados. Ejecutar lint, TypeScript y build después de cada cambio relevante, más comparaciones de navegador para los grupos indicados. Ninguno de estos pasos autoriza producción.

### Validaciones de esta segunda continuación

- `npm run lint`: código 1, **2 errores y 22 advertencias**, sin cambios respecto al estado previamente conservado.
- `npx tsc --noEmit`: código 0.
- `npm run build`: código 0; rutas estáticas `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`.
- `git diff --check`: código 0.
- Inspección del HTML generado: el `main` sigue ausente, coherente con que el plan no está implementado.
- Logs de esta ejecución en `/workspace/work/technical-audit/lint-review.log` y `build-review.log`. No se realizaron pruebas de navegador ni mediciones Web Vitals. CI usa Node 22 y el entorno local Node 24; verificar CI por separado.

Los pushes a la rama del PR pueden activar CI y un Preview automático de la integración existente. No se ejecuta despliegue manual ni se cambia configuración de Vercel; no se modifica `main` ni se fusiona el PR. Esta documentación se guarda en un segundo commit para separar lo ya implementado del plan pendiente de aprobación.

## Implementación aprobada de HTML inicial e introReady

### Alcance y commits

Se partió de `chore/technical-audit-seo` en `b224272`, con árbol limpio, tras leer `AGENTS.md` y este documento. El usuario aprobó implementar el plan, manteniendo fuera la migración de imágenes y los refactors del overlay/rail para ESLint.

- `aef79c1`: estado `introReady` y finalización estable en `SmoothScrollContext`; la pausa efectiva es `!introReady || paused`, separando la carga de la pausa que ya controla el overlay. Lenis se crea detenido y su efecto de pausa aplica el estado actual antes de avanzar el ticker.
- `120a805`: `main` y sus seis secciones se renderizan siempre; nuevo coordinador `IntroPreloader`; los efectos de Hero, Manifesto, WhoAmI y rail esperan `introReady`. El cambio del rail se limita a esa guarda y su dependencia; se conserva su estado/tween, geometría y configuración. Se añaden dos atributos de datos para el fallback sin JS.
- `7a53c4a`: refresh diferido y agrupado de ScrollTrigger, también cuando llegan imágenes o fuentes después de la preparación inicial, con cancelación de frames y retirada de listeners.
- `ae32398`: ocultación temporal de `main` exclusivamente tras hidratación, para preservar el fondo vacío debajo de la salida ascendente del preloader. Se retira al terminar, al recuperarse de un fallo o al limpiar el efecto. El servidor no emite `visibility: hidden`, `inert` ni `aria-hidden` en `main`.

Archivos de implementación: `src/app/page.tsx`, `src/components/IntroPreloader.tsx`, `src/components/SmoothScrollContext.tsx`, `src/components/SmoothScroll.tsx`, `src/hooks/useManifestoReveal.ts`, `src/hooks/useWhoAmIReveal.ts`, `src/hooks/useProjectsRail.ts`, `src/sections/Hero.tsx` y `src/sections/ProjectsRail.tsx`. No se modifican `Preloader.tsx`, `usePreloader.ts`, los paneles/reveals, el overlay, imágenes, contenidos, estilos editoriales, duraciones, easing, dependencias ni Vercel en esta implementación.

### Coordinación, recuperación y cleanup

- El servidor muestra la misma capa oscura de espera y emite todo `main`. Tras hidratar, `main` queda temporalmente `inert` e invisible, manteniendo su geometría. Se bloquea el documento con el hook existente y Lenis permanece parado. No se crean los contextos de las secciones todavía.
- `IntroPreloader` importa el componente real y prepara `document.fonts.ready` e imágenes de `main` en paralelo. Imágenes fallidas cuentan como resueltas. La preparación de recursos tiene un máximo de 4 s porque los contenedores ya fijan la geometría; no se espera indefinidamente. Este máximo puede añadir espera antes de la timeline en redes lentas, pero no cambia sus duraciones ni easing.
- El callback estable `completeIntro` solo pasa a listo; no remonta las secciones. En la ruta normal lo llama la timeline original al completar su salida. Los efectos de layout de las secciones se ejecutan en orden de documento. El rail conserva su actualización síncrona de layout para entregar el tween a los paneles. Dos RAF cancelables posponen `sort()`/`refresh()` hasta después de ese commit, sin asumir que el efecto del padre corre primero.
- Un error de importación o un error de render/efecto capturado por el boundary revela el portfolio. Un watchdog de 15 s desde el montaje recupera descargas bloqueadas o una timeline que no complete. No controla el tiempo de la ruta normal ni se usa para eludir ESLint. Los fallos se registran en consola para diagnóstico.
- Al desmontar el coordinador se abortan las esperas, se retiran listeners de imágenes, se limpian ambos timers y se ignoran imports que resuelvan tarde. Un import dinámico ya iniciado no puede cancelarse a nivel de red; se cancela su aplicación al estado. La timeline original mantiene su `tl.kill()` y el ResizeObserver su `disconnect()` al desmontar.
- La limpieza de `page.tsx` cancela los dos RAF, retira los listeners de fuentes e imágenes y restaura visibilidad/interacción. Los contextos de sección conservan `ctx.revert()`. No se refactoriza ni se declara corregido el cleanup preexistente del overlay señalado en la primera continuación.
- El fallback `<noscript>` oculta únicamente la capa de carga, restituye cursor nativo, hace legible el manifiesto y muestra los siete proyectos en flujo vertical. Con JS activo el rail continúa horizontal, con sus mismos `pin`, `scrub`, anchuras y triggers. Sin JS no se promete interacción con los casos en overlay.

### Validaciones automatizadas y HTML

| Comprobación final | Resultado |
| --- | --- |
| `npm run lint` | Código 1: los mismos 2 errores y 22 advertencias; ningún diagnóstico nuevo |
| `npx tsc --noEmit` | Código 0 |
| `npm run build` | Código 0; `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml` prerenderizados |
| `git diff --check` | Código 0 |
| Parser Python sobre `.next/server/app/index.html` | Un `main` sin ocultación/inert del servidor, seis secciones principales y siete paneles internos (13 elementos `section`); `lang="es-MX"` y canonical `https://isaiasfrutos.dev` conservados |

El lint continúa bloqueando CI: `ProjectOverlayHost.tsx` y `useProjectsRail.ts` mantienen `set-state-in-effect`; siguen las 21 advertencias de imágenes y la dependencia de Escape. No se suprimen reglas. Local: Node 24; no se afirma que los checks remotos de Node 22 hayan pasado.

### Pruebas de navegador realizadas

Se utilizó Playwright con Chromium del entorno (`/usr/bin/chromium`) contra servidores locales `next start` y `next dev`, sin abrir producción ni desplegar manualmente. Se capturó una referencia desktop antes de modificar el código; se inspeccionaron también capturas posteriores desktop/móvil. Las capturas no constituyen una comparación de píxeles sincronizada de todas las animaciones.

| Escenario | Resultado observado |
| --- | --- |
| Desktop 1440×900 | `main` con seis secciones durante la carga; cero pins, documento bloqueado. Tras terminar: sin inert/bloqueo, tres pins. Altura total 16859 px, igual a la referencia desktop inicial |
| Móvil 390×844 | Mismas fases, tres pins y altura total 11180 px; sin errores de página. Resize posterior al cierre sin errores |
| `prefers-reduced-motion: reduce` | Carga, scroll horizontal, apertura/cierre y resize funcionan sin errores. Se conserva la política previa: las animaciones siguen ejecutándose; no se implementa una nueva adaptación de movimiento reducido en esta tarea |
| Rail | Desplazamiento de 400 px produce traslación aproximada de −400 px. Se recorrieron los siete paneles en desktop; sus reveals alcanzan opacidad 1 y el último llega a posición 0 |
| Overlays | Apertura y cierre por botón en desktop/móvil/reduced motion. Recorrido por los siete casos con seis navegaciones internas, cierre por Escape, overflow restaurado y rueda posterior avanza 450 px (multiplicador Lenis original de 0.9 para 500 px) |
| Sin JavaScript, móvil | `main` presente y no inert; capa `display:none`; rail en bloque de 390 px, 16 headings y contenido desplazable. Los siete paneles permanecen en el documento |
| Chunk rechazado | Recuperación en aproximadamente 1 s; main visible, no inert, overflow restaurado y tres pins. Error esperado registrado |
| Error inyectado en `SVGPathElement.getTotalLength` | Boundary recupera contenido y scroll, sin capa persistente; error esperado registrado |
| Chunk bloqueado indefinidamente | Watchdog libera contenido y scroll aproximadamente a los 15 s; no inert y tres pins |
| Strict Mode (`next dev`) y resize durante la carga | Termina correctamente, sin errores de página, tres pins y overflow restaurado |
| Visibilidad temporal | En carga hidratada: `visibility:hidden`, inert true. Al terminar: `visibility:visible`, inert false. Sin JS se conserva visible |

Los scripts, capturas y logs se guardan fuera del repositorio en `/workspace/work/intro-ready/`: `check-final.cjs`, `failures-final.cjs`, `rail-overlay.cjs`, `browser-final.log`, `failures-final.log`, `rail-overlay.log`, `lint-final.log`, `types-final.log`, `build-final.log` y PNG de referencia/resultados. No se añadieron dependencias de pruebas ni se cambiaron package/lockfile. Los puertos locales usados fueron 3100–3104; un intento de reutilizar 3100 encontró el proceso anterior todavía activo y se continuó en otro puerto.

### Riesgos y comprobaciones pendientes antes de fusionar

- Solo se probó Chromium local. Pendientes Safari/iOS, Firefox, dispositivos táctiles reales y comparación visual completa/sincronizada de las timelines; las emulaciones de viewport no sustituyen esos dispositivos.
- Se probaron resize durante carga y tras cierre. Pendientes resize/orientación con overlay abierto y a mitad del rail, navegación muy rápida, Escape repetido, cierre durante fade y navegación/desmontaje mientras llegan recursos. Los riesgos previos del overlay siguen fuera de alcance.
- Pendientes pruebas específicas de fuentes/imágenes lentas que superen los 4 s, restauración de scroll/historial y comportamiento del watchdog al volver de una pestaña suspendida. Se añadieron listeners para refrescar mediciones tardías, pero no se declara validada toda combinación de red y navegación.
- Strict Mode verificó montaje y limpieza inicial sin pins duplicados. No se instrumentó un recuento exhaustivo de RAF/listeners vivos tras cada navegación; el cleanup nuevo se revisó estáticamente. La recuperación de errores no es una garantía ante fallos globales de hidratación o de los propios módulos GSAP.
- Pendientes lector de pantalla, recorrido completo por teclado, auditoría de movimiento reducido y Web Vitals. `inert` protege `main` durante la carga; el enlace flotante de WhatsApp del layout conserva su comportamiento y posición existentes.
- La respuesta HTML es mayor porque ahora incluye el contenido; debe medirse su impacto en transferencia y LCP. El fallback sin JS muestra los proyectos en vertical para hacerlos accesibles, sin cambiar el rail animado con JS.

Resultados y riesgos se documentan antes de subir estos commits y actualizar el PR #1. El PR debe permanecer en borrador, sin merge a `main`, cambios de Vercel ni despliegue manual. El push puede activar CI y un Preview automático de la integración ya existente.
