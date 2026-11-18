# Portfolio V2 — auditoría de rendimiento y estabilidad

Fecha: 18 de noviembre de 2026. Rama: `chore/portfolio-v2-performance-audit`.

## 1. Resumen ejecutivo

La auditoría parte de `origin/main` en `155e02807a18beef51645c7d2ef8bf1f51f6cf2c`, confirmado mediante fetch y revisión de los PR #3–8, todos integrados. El árbol inicial estaba limpio. La referencia `preview/portfolio-completo-20261118` permanece en `35146eff9cf1580884cbd5f8899d1ead3286a196`; no se utiliza para desarrollar.

Se implementaron tres optimizaciones medidas: detección del cursor agrupada por frame, actualización incremental de Manifesto y reutilización acotada de tweens del hover de letras de RightNow. Se corrigieron el nombre accesible y el landmark del enlace flotante de WhatsApp. También se actualizaron Next.js y sus dependencias afectadas por avisos de seguridad. No se modificaron imágenes, contenido profesional, estilos aprobados, geometría del rail, duraciones, easing, pins ni configuración de Lenis.

Las comprobaciones locales pasan, con las 21 advertencias de imágenes existentes. El HTML generado conserva `main` y las seis secciones. Las pruebas Chromium cubren los nueve anchos solicitados e interacciones de escritorio/móvil; no sustituyen pruebas en dispositivos físicos, otros motores o producción. Se entrega para revisión mediante PR en borrador; no se autoriza una publicación por el resultado de esta auditoría.

## 2. Estado inicial y mediciones

Se leyeron `AGENTS.md`, `README.md`, `docs/TECHNICAL_AUDIT.md`, las continuaciones de HTML inicial/introReady, auditorías V2, documentación de motion/glow y configuración/pruebas de contacto. Se revisaron las seis secciones, hooks, overlays, preloader, proveedor de scroll, cursor, estilos y lockfile antes de modificar.

Entorno local: Node 24.22.1, npm 11.9.0, Chromium 156.0.8078.79, Lighthouse 13.6.0; CI usa Node 22. Herramientas de auditoría instaladas fuera del repositorio. Playwright se resolvió desde las herramientas del entorno; no se añadió como dependencia del portfolio.

La línea base utilizó un build optimizado de `155e028`. Las mediciones específicas de código se repitieron con Next 16.2.1 antes de actualizar dependencias, para aislar esas tres optimizaciones. Lighthouse y regresión final se ejecutaron con el build de Next 16.4.6.

| Comprobación inicial                                            | Resultado                                              |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| `npm ci`                                                        | Correcto, usando caché escribible en el workspace      |
| `npm run lint`                                                  | 0 errores; 21 advertencias `@next/next/no-img-element` |
| `npx tsc --noEmit`                                              | Correcto                                               |
| `npm run build`                                                 | Correcto; `/`, robots y sitemap prerenderizados        |
| `node --experimental-strip-types --test tests/contact.test.mjs` | 5/5                                                    |
| `git diff --check`                                              | Correcto                                               |
| `npm audit --omit=dev --json`                                   | 6 paquetes señalados: 1 crítico, 4 altos y 1 moderado  |

El primer intento de instalación falló por la caché predeterminada del entorno (`ENOENT` en `.npm/_cacache`); se repitió con `npm ci --cache /workspace/work/npm-cache --no-audit --no-fund`. No fue un fallo del proyecto.

Lighthouse se ejecutó sobre localhost con emulación y throttling móvil predeterminados, sin ejecutar simultáneamente la matriz responsive. Es una muestra de laboratorio, no datos de usuarios ni validación de Core Web Vitals en producción. La métrica LCP puede corresponder a texto visible mientras el intro aún se ejecuta; no representa el tiempo para completar el preloader y comenzar a interactuar.

## 3. Hallazgos críticos

**P0 — Versión de Next afectada por avisos de seguridad; corregido en la rama.** El análisis del lockfile identificó Next 16.2.1 y paquetes transitivos afectados. Entre los avisos oficiales consultados están [RCE en optimización de SVG](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [RCE con AVIF](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) y [DoS en Server Components](https://github.com/advisories/GHSA-q4gf-8mx6-v5v3). La aplicabilidad depende de las funciones y del entorno usados; no se intentó explotar estos problemas ni se afirma que el sitio haya sido comprometido.

Se fijaron `next` y `eslint-config-next` en **16.4.6**, dentro de la misma versión mayor, manteniendo React/ReactDOM 19.2.4. El lockfile actualiza los transitivos requeridos y `source-map-js` 1.2.1 → 1.2.2 dentro del rango admitido. Se verificaron peer dependencies, build y comportamiento en navegador. `npm audit --omit=dev` final informa **0 alertas**; esto describe el alcance de esa base de avisos, no una certificación de seguridad completa.

`next dev` de esta versión añadió su bloque delimitado de instrucciones a `AGENTS.md`; se verificó el generador `node_modules/next/dist/server/lib/generate-agent-files.js` y se leyeron las guías instaladas de client components, Playwright y actualización a 16. Las instrucciones originales permanecen intactas. No se aplicaron codemods ni cambios de arquitectura.

No se reprodujeron otros fallos críticos de funcionalidad o disponibilidad en los flujos locales probados.

## 4. Problemas importantes

| Prioridad | Hallazgo y evidencia                                                                                                                                                                                   | Decisión / riesgo                                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1        | Hero PNG de 2,002,411 bytes; Onda PNG de 2,458,205 y Sectra PNG de 1,596,892. Ocho imágenes iniciales: Hero y siete paneles.                                                                           | Inventario y plan separados. No convertir ni sustituir archivos del propietario. La transferencia real depende de optimización y caché.                                                            |
| P1        | IntroPreloader espera imágenes/fuentes hasta 4 s; la animación normal dura 3.55 s; watchdog existente de 15 s.                                                                                         | HTML inicial disponible, pero la entrada interactiva conserva esta espera deliberada. Cambiarla requiere acuerdo visual y nueva medición.                                                          |
| P1        | Axe señala contraste insuficiente en un texto de Manifesto y dos textos del footer, tanto a 390 como a 1440 px.                                                                                        | Pendiente de revisión de color/opacidad; no se alteraron los estilos aprobados. La prueba en otros estados puede revelar más casos.                                                                |
| P1        | Movimiento reducido está implementado en RightNow/glow/toast, pero Hero, Manifesto, WhoAmI, rail, preloader y transición del diálogo no tienen una alternativa global equivalente. Lenis sigue activo. | Mantener el comportamiento actual; proponer por separado una navegación sin pins/reveals animados con acceso a los siete casos y mediciones correctas tras resize. No afirmar cumplimiento global. |
| P1        | No se pudo inspeccionar producción ni el preview de referencia: Chromium devolvió `ERR_TUNNEL_CONNECTION_FAILED` en ambos dominios.                                                                    | Pendientes headers, redirecciones/DNS y estado real de Production. No se tocó configuración remota.                                                                                                |

El formulario conserva Web3Forms, validaciones, honeypot `botcheck`, guard de concurrencia y confirmación estricta `success === true`. Las pruebas interceptan todas las peticiones del proveedor. La recepción previa desde Preview fue confirmada por el propietario; **la variable pública de Production no se verificó**. No se leyó ni copió una clave real, ni se enviaron correos reales.

## 5. Mejoras menores

**P2, corregidas:** trabajo repetido de hit testing en `mousemove`, escrituras GSAP de palabras que no cambian, crecimiento del historial de tweens hover en el contexto de RightNow y discrepancia entre el texto visible «Hablemos» y el nombre accesible del enlace de WhatsApp. Este enlace quedó además dentro de un `aside` con nombre, sin mover su caja fixed.

**P2, propuestas:** evaluar división/carga diferida de casos de estudio únicamente midiendo el bundle y manteniendo navegación rápida y sin parpadeos. El diálogo tiene foco inicial, ciclo Tab, Escape y retorno de foco; el fondo no se marca globalmente inert. Aislarlo requeriría revisar su ubicación dentro de `main`/portal: aplicar inert a `main` ahora desactivaría el propio diálogo. Pendiente de revisión específica con lector de pantalla.

**P3, opcionales:** asset Open Graph propio, después de recibir un archivo aprobado; revisar utilidades/paquetes sin uso solo con evidencia de peso servido. No retirar automáticamente archivos públicos sin referencias: podrían tener enlaces externos.

Se descartaron cambios sin beneficio demostrado: cachear escrituras idle del cursor (el navegador ya produjo 0 mutaciones de estilo en reposo), añadir `useMemo` a la onda del preloader (361 llamadas a `Math.sin` tanto antes como después; React Compiler ya evita recalcular durante el contador), convertir toda la página a Server Components, refactorizar overlays/rail por estilo, y retirar dependencias que pueden ser eliminadas del bundle por tree shaking. Tampoco se cambiaron el brillo 4.5, transición 0.3 s, glow, tipografía o composición aprobados.

## 6. Optimizaciones implementadas

| Archivo                                                                  | Cambio                                                                                                                                          | Comportamiento conservado                                                                                               |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/components/system/CustomCursor.tsx`                                 | El evento guarda coordenadas y último target; el RAF existente agrupa `closest` y solo cambia estado al cambiar visibilidad/tipo de target.     | Aro/punto, lerp 0.18, leyenda, límites del viewport, pointer-events y desactivación táctil.                             |
| `src/hooks/useManifestoReveal.ts`                                        | Recuerda el número de palabras activas y modifica solo el tramo que cambia; textos superior/inferior cambian al cruzar sus umbrales.            | Opacidades, secuencia reversible, umbrales 0.02/0.92, pin, inicio y fin.                                                |
| `src/hooks/useRightNowReveal.ts`                                         | Reutiliza dos tweens pausados por letra; pausa el opuesto y reinicia desde el valor actual. El cleanup mata ambos y restaura estilos/listeners. | Desplazamientos y rotaciones originales, entrada 0.28/power2.out, salida 0.45/power3.out; reveals y geometría intactos. |
| `src/components/WhatsAppButton.tsx`                                      | Nombre «Hablemos por WhatsApp» y landmark de contacto.                                                                                          | Enlace, aspecto y rectángulo fixed idénticos.                                                                           |
| `package.json`, `package-lock.json`, `AGENTS.md`                         | Actualización de seguridad y bloque generado descritos en §3.                                                                                   | Misma versión mayor; sin cambios de Vercel o arquitectura.                                                              |
| `tests/motion-stability.browser.mjs`                                     | Regresión pequeña de Manifesto reversible, RightNow/reduced motion y semántica/límites del cursor.                                              | Sin servicios externos ni dependencia nueva de producción.                                                              |
| `README.md`, este informe, inventario y `docs/assets/performance-audit/` | Estado actual, método y evidencias.                                                                                                             | Documentación histórica preservada.                                                                                     |

La instrumentación temporal de GSAP/DOM solo se usó para medir. Se retiró la ruta de fixture antes del build final; no se publica una ruta ni global de diagnóstico.

## 7. Resultados antes/después

### Trabajo específico de código

| Escenario controlado                                                                |      Antes |   Después |
| ----------------------------------------------------------------------------------- | ---------: | --------: |
| 500 eventos mousemove síncronos antes del siguiente frame: llamadas `closest`       |      1,000 |         2 |
| Manifesto: llamadas `gsap.set` sobre palabras en 61 posiciones de scroll            |        732 |        12 |
| Tweens de hover retenidos tras 100 eventos alternados y un leave final              |    0 → 101 |   24 → 24 |
| Comparación de las 61 matrices de opacidad de palabras                              | Referencia | Idénticas |
| Tres ciclos de desmontaje del fixture: triggers/tweens de nodos retirados restantes |        0/0 |       0/0 |

La cuenta de objetos demuestra retención acotada en el escenario probado; no mide ahorro en MB ni una fuga de memoria global. Las posiciones finales de hover y retorno fueron iguales. Los conteos no representan una reducción proporcional de CPU ni FPS garantizados.

### Lighthouse móvil local

| Métrica                                             |          Base | Después, muestra 1 | Después, muestra 2 final |
| --------------------------------------------------- | ------------: | -----------------: | -----------------------: |
| Performance                                         |            93 |                 97 |                       99 |
| Accessibility                                       |            98 |                 98 |                       98 |
| Best Practices / SEO                                |     100 / 100 |          100 / 100 |                100 / 100 |
| LCP                                                 |      1,146 ms |             947 ms |                   966 ms |
| CLS                                                 |             0 |                  0 |                        0 |
| TBT                                                 |        240 ms |             175 ms |                  24.5 ms |
| Speed Index                                         |      4,513 ms |           3,172 ms |                 3,159 ms |
| Tamaño de recursos Script observados, sin comprimir | 829,340 bytes |      772,703 bytes |            772,703 bytes |

Una muestra base y dos posteriores no son un estudio estadístico. La muestra 1 precede al último parche transitivo; ambas ya usan Next 16.4.6 y las mismas optimizaciones de UI. Cambiaron framework y código: no se atribuye la diferencia completa a un hook. Los bytes anteriores son `resourceSize`, no transferencia comprimida. TBT **no es INP**; no hay datos de campo para verificar el objetivo INP < 200 ms ni para declarar CWV aprobados.

### Navegador y validaciones finales

| Prueba realizada                                               | Resultado / alcance                                                                                                                                                                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Responsive 390, 640, 768, 913, 1024, 1280, 1440, 1920, 2560 px | Sin overflow de página ni colisiones de filas WhoAmI. Altura total, rectángulos de los tres pins, RightNow y contacto idénticos antes/después en los nueve anchos. Segunda tarjeta invertida en desktop.                                   |
| Capturas de RightNow a 390 y 1440 px                           | Comparación de canales: 0 diferencias en ambas capturas; no demuestra igualdad de todos los frames de animación.                                                                                                                           |
| Rail y casos, 390/1440 px                                      | Siete paneles y siete casos; navegación rápida, cierre durante entrada/fade, Escape repetido, reapertura, resize de rail y diálogo. Tres pins estables; scroll interno sin mover fondo y Lenis reanudado (450 px para rueda de 500 px).    |
| Teclado en diálogo, 390/1440 px                                | Enter abre; foco en Cerrar; Shift+Tab/Tab ciclan dentro; Escape cierra y retorna al botón de apertura.                                                                                                                                     |
| RightNow/cursor/Manifesto, 390/1440 px                         | Reversión/reentrada, estados de palabras, hover/reset, cambio dinámico de reduced motion, resize y leyenda solo en acciones; no bloquea clicks ni sale del viewport probado.                                                               |
| Build y desarrollo con Strict Mode                             | Suite nueva pasa en ambos; fixture desmontado tres veces sin triggers/tweens residuales. No prueba exhaustiva de todas las rutas de error.                                                                                                 |
| Preloader final y sin JavaScript                               | Fallo SVG inyectado recupera introReady y tres pins. Sin JS: seis secciones, main no inert, intro no visible. Error de diagnóstico esperado solo en el fallo inyectado.                                                                    |
| Web3Forms con mocks, 390/1440 px                               | Validación, carga, datos retenidos, duplicados, éxito/reset, success false/string, HTTP 429/500, JSON inválido, red fallida, honeypot, toast en portal fixed y cierre manual/5 s. 8 solicitudes interceptadas por ancho, 0 correos reales. |
| Axe, 390/1440 px                                               | Resueltos label-content-name-mismatch y region de WhatsApp; permanece color-contrast en tres nodos.                                                                                                                                        |
| Consola/hidratación en recorridos normales                     | Sin errores capturados. El fallo deliberado del preloader se registra por separado.                                                                                                                                                        |
| Calidad final                                                  | npm ci correcto; lint 0 errores/21 advertencias; TypeScript correcto; build correcto; 5/5 tests de contacto; diff --check correcto; audit de producción 0 alertas.                                                                         |

SEO inspeccionado en el HTML de `.next/server/app/index.html`: un `main`, seis secciones principales, un H1, `lang="es-MX"`, title/description, canonical `https://isaiasfrutos.dev`, Open Graph `es_MX` y Twitter `summary`. SSR no introduce inert u ocultación permanente en main. Robots permite `/` y referencia el sitemap del mismo dominio; sitemap contiene el origen canónico. No existe imagen OG propia y no se inventó una. No se hicieron cambios SEO innecesarios.

Comandos ejecutados antes/después (la caché alternativa es propia de este entorno):

```bash
npm ci --cache /workspace/work/npm-cache --no-audit --no-fund
npm run lint
npx tsc --noEmit
npm run build
git diff --check
node --experimental-strip-types --test tests/contact.test.mjs
npm audit --omit=dev --json
TEST_URL=http://localhost:3173 node tests/motion-stability.browser.mjs
TEST_URL=http://localhost:3174 node tests/motion-stability.browser.mjs
TEST_URL=http://localhost:3174 REPORT_PATH=/workspace/work/performance-audit/contact-final.json node tests/contact-web3forms.browser.mjs
```

El servidor de desarrollo 3174 recibió únicamente una clave ficticia en el proceso de pruebas. El test del formulario requiere que la variable pública esté presente para alcanzar el mock. Para repetir navegador se necesitan Playwright y Chromium disponibles; el test nuevo usa `/usr/bin/chromium`, igual que el existente. No se añadieron estas suites al CI sin instalar antes sus requisitos.

Lighthouse se invocó con `--only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox" --output=json` contra el servidor local optimizado. Las matrices/benchmarks adicionales usaron Playwright, instrumentación temporal de `Element.closest` y GSAP, observadores Performance y comparación de rectángulos/capturas. Evidencia resumida sin credenciales: [resultados](assets/performance-audit/results.json), [benchmarks](assets/performance-audit/micro.json), [capturas](assets/performance-audit/README.md).

## 8. Riesgos y regresiones

La actualización menor de Next afecta compilador/runtime y necesita revisar la preview generada por este PR antes de integrar. Las pruebas actuales no muestran regresiones en las interacciones cubiertas; no garantizan igualdad de cada frame, todos los dispositivos o cualquier combinación de navegación.

Pendientes: Safari/Firefox, iOS/Android reales, lector de pantalla, trazas prolongadas/heap snapshots, INP de usuarios reales, red lenta real con assets nuevos, inspección remota de producción y configuración de Web3Forms Production. La UI es cliente por sus animaciones; no se convirtió a servidor por sistema. El LCP local no cuantifica toda la espera intencional del intro.

La prueba responsive inicialmente leyó un resize aún pendiente en 2560 px al cambiar de pestaña; se corrigió el harness para esperar el padding del rail y traer la página al frente. Una prueba de cursor también necesitó esperar la transición de opacidad. No se modificó producto para ocultar fallos del harness.

No se cambiaron Vercel, DNS, certificados, main ni la rama de referencia; no se intentó una publicación manual. El estado remoto de CI y la preview se registran en la descripción del PR; los resultados de esta tabla corresponden a pruebas locales.

## 9. Inventario de imágenes pendiente de migración

Consultar [IMAGE_OPTIMIZATION_INVENTORY.md](IMAGE_OPTIMIZATION_INVENTORY.md): nueve raster, cinco SVG y favicon, con rutas, dimensiones, bytes, referencias, prioridad, next/image/sizes y riesgos. Los 15 archivos de `public` conservan sus hashes SHA-256; favicon y referencias tampoco se modificaron. `tryfum-bg.jpg` contiene WebP según su firma: se registra la discrepancia sin renombrar.

Las 21 advertencias corresponden a siete paneles, siete Hero de casos y siete Feature. Una migración correcta de esos usos puede resolverlas; no todas las imágenes deben recibir priority ni migrarse sin comprobar sus cajas y animaciones. Las capturas añadidas a docs son evidencia de auditoría, no sustituciones de assets del sitio.

## 10. Próximos pasos recomendados

1. Revisar el PR y su preview, especialmente tras la actualización de Next; comprobar CI con Node 22. Mantener borrador y no fusionar hasta aprobar.
2. Revisar los tres textos con bajo contraste y acordar una alternativa de movimiento reducido para las secciones heredadas y Lenis. Preparar propuesta visual antes de tocar pins o timings.
3. Recibir los archivos optimizados del propietario, aplicar el plan del inventario por grupos y volver a medir red, LCP, CLS, recortes y scroll.
4. Verificar Web3Forms en Production con el propietario y una prueba manual autorizada; no generar correos automáticos. Revalidar headers y dominio desde un entorno con acceso.
5. Recoger métricas de campo antes de evaluar INP y los objetivos CWV. Investigar carga diferida de casos solo si el perfil muestra un beneficio suficiente.
