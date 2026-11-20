# Recent Activity — Fase 1: accesibilidad y foco

Base: `origin/main` en `ec6eab43339a862956a7457f3704de971d47e1b2`. Rama: `fix/recent-activity-accessibility`. Fecha: 20 de noviembre de 2026.

## Alcance y reproducción

Se leyeron AGENTS.md, RECENT_ACTIVITY_PROTOCOL.md, RECENT_ACTIVITY_PUBLISHING.md, el componente real y las pruebas existentes. No había cambios locales; main seguía en el commit de la auditoría. Los tres errores seguían presentes:

- **B07:** cuatro cierres con Escape (entrada completa, 20 ms y cierre inmediato) devolvían el foco a BODY; el control todavía estaba inert al intentar enfocarlo en el cleanup.
- **B08:** retirar mediante un feed simulado el acordeón enfocado dejaba el foco en BODY. La siguiente pulsación de Tab llegaba a TradeMate detrás del diálogo abierto.
- **B06:** Axe señalaba label-content-name-mismatch para el botón de descanso: zzz... no formaba parte de su nombre accesible.

La regresión encontró además un cierre que podía quedar pendiente antes del primer tick de GSAP, especialmente con reduced motion. Se reprodujo en la base pausando el reloj de prueba antes de abrir: invertir una timeline todavía en tiempo cero no completaba el cierre.

Las reproducciones y pruebas usan publicaciones ficticias interceptadas en el navegador. No modifican los datos publicados ni generan etapas o mensajes reales.

## Solución localizada

Solo cambia `src/components/RecentActivityDock.tsx` en runtime:

1. Capturar el botón que solicita la apertura antes de que pueda desmontarse, incluyendo el CTA de la notificación.
2. Devolver el foco en un layout effect posterior al cierre, cuando introReady es true y paused ya es false. En ese commit el control vuelve a ser interactivo. Si el opener desapareció o no puede recibir foco, usar el botón flotante. No se añaden timers para restaurar foco.
3. Aislar con inert los hermanos del contenedor modal a lo largo de su ascendencia, sin marcar inert un ancestro del propio panel. Restaurar los valores previos al cerrar.
4. Mientras el panel está abierto, un MutationObserver cubre controles retirados/deshabilitados, cambios del feed y portales añadidos al fondo. Un listener focusin y el ciclo Tab/Shift+Tab mantienen el foco dentro. No se observan los cambios de style usados por GSAP ni se añade trabajo a mousemove/scroll.
5. Desconectar observer y listeners y restaurar inert durante cleanup. Mantener la pausa/reanudación existente de Lenis.
6. Nombrar el estado de descanso «zzz... En horario de descanso. Ver las actualizaciones», conservando el texto visual y su animación.
7. Si se solicita cerrar antes de que la timeline avance, desmontar el panel que aún está en su posición cerrada. Con tiempo mayor que cero, conservar exactamente la reversa y su callback originales. No se cambian duraciones, easing ni desplazamientos.

La gestión del foco no depende de la estructura de un registro concreto ni reinicia la timeline cuando cambia el feed.

## Pruebas

Se reutiliza Playwright con Chromium, como en las suites existentes; no se añaden dependencias, servicios ni cambios de CI.

Nueva suite: `tests/recent-activity-accessibility.browser.mjs`. Cubre 360/390/768/1440 px con movimiento normal y 390/1440 con reduced motion:

- Apertura mediante Enter y foco inicial en Cerrar panel.
- Escape, botón y backdrop; retorno al control interactivo.
- Cierre antes del primer frame, con tiempo cero controlado, y cierre durante entrada.
- Tab/Shift+Tab y tentativas de enfocar controles de fondo.
- Exclusión de proyectos y WhatsApp del árbol de accesibilidad nativo de Chromium.
- Retirada de la actividad enfocada, adición de un acordeón y cambio a tarjeta no expandible.
- Preservación del foco cuando una actualización no elimina el control activo.
- Feed vacío: Tab y Shift+Tab permanecen en el control de cierre.
- Portales añadidos posteriormente, restauración de inert y conservación de estados inert previos.
- Doce ciclos consecutivos a 390 px, tanto normales como con reduced motion; tres pins y scroll lock restaurado.
- Apertura desde una notificación cuyo CTA se desmonta: fallback al botón flotante.
- Nombre accesible en horario de trabajo y descanso; sin errores JS o de hidratación en los recorridos normales.

El reloj de pruebas avanza: congelar Date.now detendría el ticker de GSAP y no serviría para verificar sus transiciones. Las comprobaciones de aislamiento usan el árbol AX de Chromium y foco nativo; los selectores de roles de Playwright por sí solos no representan fielmente inert.

Comandos de validación:

```bash
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run lint
npx tsc --noEmit
node --experimental-strip-types --test tests/*.test.mjs
npm run build
git diff --check
TEST_URL=http://localhost:3201 REPORT_PATH=/workspace/work/activity-accessibility/browser.json node tests/recent-activity-accessibility.browser.mjs
TEST_URL=http://localhost:3202 REPORT_PATH=/workspace/work/activity-accessibility/browser-dev.json node tests/recent-activity-accessibility.browser.mjs
TEST_URL=http://localhost:3201 node tests/motion-stability.browser.mjs
TEST_URL=http://localhost:3202 REPORT_PATH=/workspace/work/activity-accessibility/contact.json node tests/contact-web3forms.browser.mjs
```

El puerto 3201 sirve el build optimizado. El 3202 es desarrollo/Strict Mode, con clave ficticia solo en el proceso; todas las peticiones de Web3Forms se interceptan. Playwright y `/usr/bin/chromium` deben estar disponibles en el entorno, igual que para las suites previas. CI existente ejecuta calidad, unitarios y build; no incluye las suites opcionales de navegador.

Calidad: instalación correcta; lint 0 errores y 21 advertencias de imágenes existentes; TypeScript correcto; 12/12 unitarios (contacto, ventana temporal y Open Graph); build correcto. Sin reglas desactivadas ni modificaciones del lockfile.

Una comprobación CDP independiente de 12 ciclos conservó exactamente los listeners de window/document, tres pins y overflow restaurado; el foco terminó en un botón en todos los cierres y Lenis volvió a desplazar 450 px ante una rueda de 500 px. Axe dejó de señalar label-content-name-mismatch en descanso. Los resultados de navegador incluyen build y desarrollo/Strict Mode.

También se ejecutaron la regresión de los siete paneles/casos, navegación rápida, Escape repetido, resize y restauración de Lenis; la suite de motion/cursor; el formulario con mocks; y recuperación ante fallo SVG del preloader y acceso sin JS. El fallo deliberado del preloader genera su diagnóstico esperado, separado de los errores de recorridos normales.

## Comportamiento visual antes y después

Se comparan los mismos registros simulados, viewport, reloj, scroll y estado del panel. Se deja terminar la entrada y se desactivan las animaciones CSS solo al capturar, para evitar comparar fases distintas de los puntos del botón. No se comparan píxeles entre diferentes instantes de GSAP.

Los rectángulos del Hero, panel y botón son idénticos antes/después en los cuatro anchos, sin overflow. Los PNG no son idénticos píxel a píxel; esa variación se conserva en los resultados y no se presenta como equivalencia de todos los frames. No cambian clases visuales ni bytes de assets.

Las capturas y resultados finales se guardan en `docs/assets/recent-activity-accessibility/`. Al cerrar con teclado vuelve a mostrarse el foco del control que abre: esa es la corrección funcional esperada, no un nuevo estilo.

## Riesgos y revisión pendiente

El aislamiento es temporal y nativo; debe revisarse en Safari/Firefox, dispositivos físicos y con lector de pantalla real. Chromium valida árbol AX, teclado y restauración, pero no sustituye esas pruebas. Nuevos controles o portales de fondo quedan inert mientras el panel está abierto; las pruebas comprueban su restauración. No se afirma ausencia global de fugas de memoria.

La preview debe revisarla el propietario antes de integrar. El estado real de CI y el enlace automático de Vercel se registran en el PR. No se despliega manualmente ni se fusiona main.

## Qué NO se modificó

- Hero cómic, imagen JPEG Open Graph, archivos gráficos, rutas y metadata.
- Diseño, clases visuales, colores, opacidades, tipografía o dimensiones del dock.
- Duraciones, easing y desplazamientos GSAP; parallax, reveals, preloader y geometría del rail. La única corrección de control de timeline es el cierre en tiempo cero descrito arriba.
- Implementación de Lenis, proveedor de scroll o hook compartido de scroll lock.
- Formulario de contacto, Web3Forms o credenciales.
- Registros, avances, IDs o estados de Recent Activity; no hay publicación de esta tarea.
- API, polling, almacenamiento, validación del feed, caducidad o dependencias: pertenecen a fases posteriores.
- main, producción, configuración de Vercel y preview consolidada.

Esta entrega termina exclusivamente la Fase 1. La Fase 2 requiere autorización posterior.
