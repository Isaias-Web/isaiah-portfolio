# Portfolio V2 — segunda revisión de PageSpeed y estabilidad

Fecha: 18 de noviembre de 2026. Rama `chore/portfolio-v2-pagespeed-review`.

## 1. Resumen ejecutivo

No se encontró una optimización de producto suficientemente justificada para modificar la experiencia aprobada. Se preservan código de aplicación, imágenes, sizes, configuración de compilación y dependencias. Se entrega diagnóstico y evidencia de nuevas pruebas sobre el main actual. No se promete mejorar una puntuación externa mediante una medición local.

## 2. Estado del repositorio

Fetch de origin y creación de rama desde `origin/main`: **2cb77b88ffb1b014b345dc235a102cc712ff5eeb**. Árbol inicial limpio. Los PR #10 (rendimiento/seguridad), #12 (WebP) y #14 (Hero/hover) están integrados, confirmado en GitHub. Se leyeron AGENTS.md, README, auditoría anterior y los hooks actuales. La referencia visual vigente incluye brightness 1.5 y Hero sin la capa negra eliminada en #14; no se restauran los valores anteriores. No se desarrolla sobre la preview consolidada.

## 3. Resultados de PageSpeed proporcionados

El propietario reportó evaluación móvil del 18/11/2026, Moto G Power emulado/4G lenta: Performance **94**, Accessibility **97**, Best Practices/SEO **100/100**, FCP/LCP **2.0 s**, TBT **0 ms**, CLS **0**, Speed Index **5.0 s**. Son resultados proporcionados, no medidos por Codex. Los ahorros de 14 KiB de JS y 158 KiB de imágenes son estimaciones del diagnóstico externo, no bytes ahorrados por este PR.

## 4. Mediciones reproducibles de Codex

Lighthouse 13.6.0, Chromium local, build optimizado de Next 16.4.6, localhost:3180, throttling móvil simulado predeterminado. Una muestra, sin ejecutar otras suites durante Lighthouse:

| Métrica                                            | Main actual / rama sin cambios de runtime |
| -------------------------------------------------- | ----------------------------------------: |
| Performance / Accessibility / Best Practices / SEO |                      100 / 98 / 100 / 100 |
| FCP / LCP                                          |                              928 / 928 ms |
| TBT                                                |                                   56.5 ms |
| CLS                                                |                                         0 |
| Speed Index                                        |                                   2789 ms |
| Recursos Script                                    |                                         9 |
| Script resourceSize / transferSize                 |                     772656 / 225311 bytes |

Las condiciones difieren de PageSpeed remoto: no comparar 94→100 como mejora. No hay INP de campo. LCP tampoco mide cuándo finaliza el intro. Lighthouse registra tareas de 189, 109, 104 y 53 ms; el TBT solo suma el exceso relevante en su ventana de medición, por eso no coincide con la suma de tareas. La atribución es parcial (documento/chunks/indeterminada), no una identificación de componente React.

Se guardan [resultados resumidos](assets/pagespeed-review/results.json), con configuración, diagnósticos y pruebas. Los nombres hash de los chunks son propios de este build.

Comandos ejecutados:

```bash
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run lint
npx tsc --noEmit
npm run build
git diff --check
node --experimental-strip-types --test tests/contact.test.mjs
npm run start -- --port 3180
CHROME_PATH=/usr/bin/chromium node /workspace/work/performance-audit/tools/node_modules/lighthouse/cli/index.js http://localhost:3180 --only-categories=performance,accessibility,best-practices,seo --chrome-flags='--headless --no-sandbox' --output=json --output-path=/workspace/work/pagespeed-review/lighthouse.json
TEST_URL=http://localhost:3180 node tests/motion-stability.browser.mjs
TEST_URL=http://localhost:3181 REPORT_PATH=/workspace/work/pagespeed-review/contact.json node tests/contact-web3forms.browser.mjs
TEST_URL=http://localhost:3181 node tests/motion-stability.browser.mjs
```

Lighthouse/Playwright son herramientas externas del workspace, no dependencias añadidas al proyecto. Para reproducir en otro equipo, instalar esas herramientas aparte y ajustar rutas a Chromium/CLI. El dev server 3181 usa exclusivamente una clave ficticia de proceso; las solicitudes Web3Forms se interceptan. Ningún correo real ni clave real se utiliza. Suites auxiliares de responsive, rail, teclado y CDP reutilizan el método anterior sobre el HEAD nuevo; son pruebas locales, no datos de usuarios.

## 5. Explicación de las advertencias

**JavaScript heredado.** Lighthouse identifica **13910 bytes estimados** en `092r-mewpaf3q.js`: Array.at/flat/flatMap, Object.fromEntries/hasOwn y String.trimStart/trimEnd. El chunk comienza con comprobaciones de disponibilidad y polyfills; las APIs coinciden con `next/dist/build/polyfills/polyfill-module.js`. Son compatibilidad del framework, no siete implementaciones manuales del portfolio. No eliminar mediante alias, parche de node_modules o cambio de browserslist: no se demostró ahorro de transferencia/ejecución compatible en los navegadores soportados. La estimación no representa tiempo bloqueado ni todo el tamaño del chunk.

**Forced reflow.** El insight registra **53.815 ms sin atribución**. Una traza CDP adicional de scroll adelante/atrás a 1440 y resize a 1024 registra 29 eventos Layout, 86.822 ms totales, máximo 75.796 ms, sin stack utilizable; conserva tres pins. Estos eventos incluyen layout normal, no todos son reflows forzados. No es válido asignar esos 53.8 ms a GSAP por mera presencia de la librería.

Revisión de fuentes: ScrollTrigger lee scrollWidth para calcular recorrido y mide durante refresh; RightNow mide top corregido por su propio y; canvas/getComputedStyle calcula kerning al montar; Preloader usa clientWidth al resize; glow lee getBoundingClientRect durante pointer/scroll activo. Esos son candidatos para perfilar, no culpables demostrados. Cursor escribe transforms en RAF y no lee rectángulos. Lenis usa un único callback del ticker, removido al desmontar. Cachear bounds sin invalidación o eliminar refresh podría romper pins/glow; no se implementa. Para una siguiente sesión, obtener stacks con source maps y separar entrada, scroll, glow y resize en trazas independientes.

**Árbol de red.** Cadena crítica observada documento → CSS, máximo 136 ms en la red local sin simular del trace. No equivale a 136 ms en 4G. No hay solicitudes de fuentes: la tipografía usa fuentes del sistema. Lighthouse no propone preconnect; los recursos críticos son del mismo origen. Web3Forms solo se necesita al enviar; no merece precarga crítica. El chunk dinámico del preloader es parte de la entrada deliberada; se conserva el límite de preparación de recursos y watchdog existentes.

**Bloqueo del render.** Dos CSS: `0tfghw2b6xx_5.css` (9873 bytes transferidos, duración señalada 164 ms) y `06c4r2p5w16yd.css` (978 bytes, 314 ms). No sumar duraciones como ahorro total: las cargas se solapan y Lighthouse modela el impacto. Son estilos de la aplicación y toast generados por el build. Diferirlos o aplicar carga asíncrona puede causar FOUC y cambios de composición; no se modifica el pipeline por este coste pequeño.

**Imágenes.** Los 158 KiB estimados externos quedan informativos. No se tocaron formatos, compresión, rutas, dimensiones, next/image ni sizes. El inventario anterior es histórico y antecede a #12/#14; no debe interpretarse como estado actual de archivos eliminados o convertidos.

## 6. Problemas e impacto

| Hallazgo                                                                                                                 | Clasificación y decisión                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Axe tras el intro: texto `.lowercase` de Manifesto y dos párrafos del footer `.text-white/40` con contraste insuficiente | Corrección visual pequeña que requiere aprobación. Persisten, no se consideran resueltos ni se presupone aceptación permanente del propietario.                                            |
| Lighthouse: `landmark-one-main` mientras el intro hace main temporalmente inert                                          | Estado transitorio a investigar; main existe en SSR. No quitar inert para subir la nota: afectaría foco e interacción detrás del preloader. Axe después del intro no reproduce esta regla. |
| Movimiento reducido parcial                                                                                              | Limitación temporal heredada: RightNow/glow/toast responden; no existe alternativa global equivalente para todas las animaciones/pins/Lenis. Requiere plan visual.                         |
| Compatibilidad JS/CSS crítico                                                                                            | Coste conocido; no es por sí mismo un defecto funcional. Sin modificación de build justificada.                                                                                            |

Las correcciones semánticas seguras de #10 (nombre/landmark WhatsApp) permanecen; no se encontró una nueva corrección técnica sin impacto visual que justificara tocar runtime.

## 7. Optimizaciones implementadas

Ninguna modificación de runtime. Solo este informe y evidencia de validación. No se añaden commits cosméticos ni se repiten cambios de #10. Se confirma en fuentes que cursor agrupa hit testing por RAF y limita setState a cambios; Manifesto actualiza solo palabras que cambian; hover RightNow reutiliza dos tweens por letra y los mata/restaura al cleanup. Los listeners tienen retiradas correspondientes y los contexts se revierten. No hay evidencia nueva de crecimiento de recursos; esta inspección no sustituye un heap snapshot prolongado.

## 8. Comparación y validación

No hay comparación antes/después de optimizaciones nuevas: runtime es idéntico a main. No se atribuye la puntuación local a cambios de este PR.

- npm ci, lint, TypeScript, build y diff --check correctos. Lint: 0 errores, 21 advertencias de imágenes deliberadamente sin migrar. Tests de validación: 5/5.
- Matriz Chromium 390/768/1024/1440/1920: sin overflow de página ni colisiones WhoAmI, un H1; tres pins. Axe a 390/1440 conserva los tres nodos de contraste descritos; sin errores normales capturados.
- Suite motion sobre producción: pasa a 390/1440; Manifesto ascendente/descendente, RightNow reversible, cambio dinámico reduced motion y cursor/leyenda dentro del viewport.
- Rail: siete paneles y siete casos, navegación rápida, Escape repetido, cierre durante entrada/fade, reapertura y resize; scroll interno separado del fondo y Lenis reanudado. Sin errores capturados.
- Formulario mock y motion en dev/Strict Mode: resultados en evidencia. No se hicieron envíos reales.
- Foco/teclado del diálogo: Enter, Tab/Shift+Tab, Escape y retorno al botón de apertura; resultado registrado en evidencia.

## 9. Riesgos de regresión

El único diff es documental, por lo que no cambia la experiencia. Las pruebas en Chromium emulado no garantizan comportamiento en dispositivos físicos, Safari/Firefox o lector de pantalla. Tres pins estables no demuestran por sí solos ausencia de cualquier trigger o listener retenido; faltan heap snapshots y trazas de sesiones largas. No se evaluó producción con las condiciones exactas del propietario ni se verificó configuración de Web3Forms Production. CI y preview se documentan en el PR con sus resultados reales.

## 10. Próxima fase recomendada

1. Comparar la preview con la consolidada desde el mismo dispositivo/red; repetir PageSpeed varias veces sin convertir variación normal en una mejora atribuida.
2. Aprobar cambios pequeños de contraste con muestras visuales y acordar alternativa global de movimiento reducido.
3. Perfilar stacks de reflow por escenario antes de cachear dimensiones; preservar refresh, pins y referencias de GSAP.
4. Evaluar imágenes en una tarea separada conforme al alcance del propietario.
5. Considerar reducción de polyfills solo con soporte oficial del framework, matriz de compatibilidad y beneficio medido. No perseguir 100 a costa de estabilidad.

No se fusiona main ni se cambian producción, Vercel o preview consolidada.
