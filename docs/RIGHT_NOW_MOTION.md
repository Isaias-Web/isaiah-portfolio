# RightNow — motion design e integración GSAP

Continuación aprobada del PR #4 sobre `feat/portfolio-v2-implementation`, sincronizada con el remoto en `36215e2` antes de editar. Se revisaron AGENTS, README, las auditorías, Hero, WhoAmI, Manifesto, GSAP compartido, SmoothScroll e `introReady`. El árbol inicial estaba limpio. Se conserva la composición editorial aprobada: contenido, tipografía, colores, columnas y espaciados.

## Archivos y commits

| Archivo | Cambio |
| --- | --- |
| `src/hooks/useRightNowReveal.ts` | Timelines locales, hover, media queries, recuperación y cleanup |
| `src/sections/RightNow.tsx` | Ref del hook, targets declarativos y letras en dos capas |
| `src/animations/letter-motion.ts` | Los ocho offsets originales, compartidos como datos |
| `src/sections/Hero.tsx` | Solo importa esos datos; su efecto completo permanece idéntico a la base |
| Documentación | Este informe, referencia desde `PORTFOLIO_V2_IMPLEMENTATION.md` y evidencias en `docs/assets/right-now-motion/` |

Commits de código: `745d9d4` (título y hover), `5a965ab` (UIC/IA y recuperación), `639be53` (preparación de grupos al reproducir, evitando destellos). No cambian los hooks de Hero/Manifesto/WhoAmI/rail, GSAP compartido, Lenis, preloader, overlays, imágenes, dependencias o Vercel. No se fusiona ninguna rama.

## Timelines y activación

El hook espera `introReady`. Crea **12 ScrollTriggers sin pin**, en flujo natural, con `start: "top 92%"`, `once: true` y `toggleActions: "play none none none"`. Las entradas se reproducen una vez por montaje; al volver hacia arriba el texto permanece legible. No usan scrub ni añaden distancias de scroll.

El lenguaje es `opacity: 0 → 1`, `y: 18 → 0`, `power3.out` y duración base de 0.55 s. El desplazamiento coincide con los 18 px de WhoAmI; el easing sigue el Hero, adaptado a entradas temporales sin pin.

| Grupo | Triggers | Secuencia |
| --- | ---: | --- |
| PERFIL ACTUAL | 1 | Label a 0; 12 letras desde 0.18 s, duración 0.65 s y stagger de 0.035 s |
| Identidad UIC | 1 | Label a 0; título a 0.16; universidad/área a 0.4 con stagger 0.08; fecha a 0.66 |
| Texto principal UIC | 1 | Fade/desplazamiento al aproximarse su propio párrafo |
| Responsabilidades | 3 | Un trigger por fila, con separación temporal de índice × 0.07 s |
| Identidad IA | 1 | Label a 0; tres líneas desde 0.16 con stagger 0.1; párrafo a 0.5 |
| Problema/Implementación/Validación | 3 | Entrada por elemento al llegar al viewport, índice × 0.07 s |
| Automatización técnica/operativa | 2 | Entrada por bloque, índice × 0.07 s |

Las columnas largas de móvil se activan por elemento, evitando que su entrada termine fuera de pantalla junto a la columna de escritorio. En desktop pueden coincidir las entradas de columnas independientes; las secuencias internas conservan su jerarquía.

No hay ocultación CSS ni estados iniciales ocultos en el HTML. Una operación `.set()` con `immediateRender: false` prepara cada grupo **al empezar su timeline**; después comienza el stagger. Si el trigger no se ejecuta, el contenido conserva su presentación estática. Así se evita tanto esconder contenido indefinidamente como mostrarlo y ocultarlo antes de cada letra retrasada.

## Letras, hover y tipografía

La capa exterior de cada letra recibe la entrada; la interior recibe exclusivamente el hover. No compiten por el mismo transform. El H2 conserva el nombre accesible «Perfil actual»; las letras decorativas están agrupadas con `aria-hidden`, sin nuevos controles ni tab stops.

Se reutilizan los ocho offsets del Hero: máximos de 14 px en X, 12 px en Y y 4° de rotación. Entrada de hover: 0.28 s, `power2.out`; retorno: 0.45 s, `power3.out`; `overwrite: "auto"`. Solo se registran listeners con `(hover: hover) and (pointer: fine)` y movimiento permitido. No hay hover táctil.

Cada palabra permanece en una línea. Los inline blocks pierden kerning entre glifos: se mide el avance de la fuente local mediante canvas y se restituyen las diferencias en `em`, conservando el tamaño responsive. No se dibuja ni transmite una imagen. Si la medición no está disponible, el contenido sigue legible. En Chromium, la diferencia máxima medida de ancho respecto a la base es inferior a 0.08 px; no cambian alturas.

## Movimiento reducido, errores y cleanup

- `gsap.matchMedia()` deja RightNow estático con `prefers-reduced-motion: reduce`: sin entradas ni hover. Cambiar la preferencia durante una entrada revierte transforms/opacidad y retira listeners; volver a permitir movimiento crea un único conjunto.
- `gsap.context()` y los contextos de media contienen las animaciones. El cleanup retira hover y listeners de error/rechazo, revierte media/contexto y restaura los estilos originales. No se añaden timers, RAF propios ni tickers.
- Los errores de setup se capturan dentro de los callbacks de GSAP para que su contexto activo pueda restaurarse. Un error no capturado o rechazo posterior desactiva el motion de esta sección y restituye su lectura hasta el próximo montaje. Se prioriza la visibilidad sobre continuar una animación incompleta.
- El HTML prerenderizado contiene main, las seis secciones y los 44 targets nuevos sin opacity/transform de ocultación. El acceso sin JavaScript conserva contenido y scroll nativo.

El fallback tiene alcance local. No recupera por sí solo un desmontaje de React ni averías globales del motor compartido. Una exploración que hacía fallar `getBoundingClientRect` globalmente afectó también el refresh del rail y desmontó la página en dev; no se presenta como una prueba recuperada. Las inyecciones locales de medición y creación de timeline sí recuperaron contenido. No se refactorizó el rail para ampliar este alcance.

## Validaciones y resultados

| Comando | Resultado final |
| --- | --- |
| `npm run lint` | Código 0: 0 errores y las mismas 21 advertencias de imágenes |
| `npx tsc --noEmit` | Código 0 |
| `npm run build` | Código 0: las cuatro rutas estáticas habituales |
| `git diff --check` | Código 0 |
| Inspección del HTML | Un main, seis secciones directas, un H1, es-MX/canonical conservados y RightNow prerenderizado visible |

Chromium/Playwright local: motion en `next dev`/Strict Mode y regresión sobre el build optimizado. Se observaron errores de página e hidratación; los recorridos normales no registraron ninguno.

| Ancho | Entradas/retorno | Hover | Cambio de altura de documento/RightNow | Pins |
| --- | --- | --- | --- | ---: |
| 390 | Correctos | Desactivado, táctil emulado | 0 / 0 px | 3 |
| 768 | Correctos | Correcto | 0 / 0 px | 3 |
| 913 | Correctos | Correcto | 0 / 0 px | 3 |
| 1024 | Correctos | Correcto | 0 / 0 px | 3 |
| 1280 | Correctos | Correcto | 0 / 0 px | 3 |
| 1440 | Correctos | Las 12 letras y sus retornos | 0 / 0 px | 3 |

- Se muestrearon frames de opacity/y y su progresión, entradas de UIC/IA, filas, scroll lento y saltos rápidos, vuelta hacia arriba/abajo y lectura estable tras la primera entrada. Sin overflow.
- Un fixture **temporal**, eliminado antes del build y fuera del diff, probó cuatro desmontajes/remontajes en Strict Mode: 12 triggers/24 listeners de hover → 0/0, sin tweens vivos sobre nodos retirados. Tres cambios ida/vuelta de reduced motion no acumularon recursos. Resize mantuvo el recuento. La inyección de fallo al crear la timeline UIC revirtió incluso la timeline de título creada antes y dejó el contenido visible.
- Sobre el build: sin JS y movimiento reducido desde la carga; fallo local de medición; error durante la entrada; cambio posterior de media query sin reactivar un contexto fallido. Se mantuvieron los tres pins. Los diagnósticos esperados de las inyecciones se separan de errores normales.
- Regresión desktop/móvil: siete reveals y casos, ráfagas de navegación, cierre durante apertura/fade, reapertura, Escape repetido, scroll interno sin mover fondo y resize dentro del rail/con overlay. Lenis recuperó 450 px para una rueda de 500, como antes.
- Hero conserva su efecto y sus offsets; se comprobó también su hover. Manifesto reveló 0/6/12 palabras en los puntos inicial/medio/final y WhoAmI mostró sus 18 filas. La matriz responsive adicional de nueve anchos no detectó colisiones ni overflow.
- Las posiciones y alturas de los tres pin-spacers coinciden exactamente con `36215e2` en los seis anchos. La altura total sigue siendo 18257 px a 1440×900 y 13462 px a 390×844.

## Evidencias y revisión pendiente

Los scripts/logs completos están en `/workspace/work/portfolio-v2-motion/`. Se incorpora un [resumen de aceptación](assets/right-now-motion/acceptance.json), [grabación](assets/right-now-motion/right-now-motion.webm) y capturas: [entrada del título](assets/right-now-motion/title-entry.png), [hover](assets/right-now-motion/title-hover.png), [entrada UIC](assets/right-now-motion/uic-entry.png), [entrada IA](assets/right-now-motion/ai-entry.png), [desktop](assets/right-now-motion/desktop.png) y [móvil](assets/right-now-motion/mobile.png).

Pendientes: revisión estética del ritmo en la preview automática del PR #4; Safari/Firefox, móvil físico, lector de pantalla y percepción de movimiento en dispositivos reales. La política de reduced motion nueva se limita a RightNow; Hero, Manifesto, WhoAmI y rail mantienen sus comportamientos anteriores. No se mide una mejora de Core Web Vitals ni se declara una auditoría global de memoria. No hay despliegue manual, merge ni cambios de producción/Vercel.
