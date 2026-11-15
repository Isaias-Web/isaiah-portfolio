# RightNow — reveals reversibles

Base: `feat/portfolio-v2-implementation` en `a8eb9bc`, sincronizada antes de editar y sin cambios locales. Continuación aprobada del PR #4; conserva composición, contenido, duraciones, easing, stagger y desplazamiento de 18 px de la entrega anterior.

## Decisión técnica

Solo cambia `src/hooks/useRightNowReveal.ts`. Cada una de las 12 secuencias conserva su timeline, ahora pausada y controlada por un ScrollTrigger persistente, sin pin. No hay nuevos triggers por dirección, RAF, timers o estado React.

Se utiliza una banda de histéresis de **16% de la altura del viewport**:

| Cruce | Comportamiento |
| --- | --- |
| Bajando, el elemento llega al 108% (`onEnter`) | Conserva el estado oculto; no empieza aún |
| Bajando, llega al 92% (`onLeave`) | `play()` desde la posición actual |
| Subiendo, vuelve al 92% (`onEnterBack`) | Conserva la lectura; no se oculta ni reinicia |
| Subiendo, sale más allá del 108% (`onLeaveBack`) | `reverse()` desde la posición actual |

Invertir la dirección dentro del viewport o recorrer la banda no reinicia la timeline. Se oculta cuando el grupo ya está por debajo del viewport, preservando legibilidad. Al volver hacia Hero, los grupos recuperan progresivamente su estado inicial; al bajar se revelan otra vez. Las interrupciones rápidas continúan desde el playhead actual, sin `restart()` ni saltos a cero.

El estado inicial oculto se aplica exclusivamente en cliente después de `introReady`, con movimiento permitido. Se retira el `.set()` de duración cero de las timelines: al invertirlo podía restituir el estilo visible original justo en cero. Las entradas usan `.to()` sobre ese estado inicial y al invertir terminan en opacity 0/y 18, incluyendo los espacios previos al stagger. El hover sigue en la capa interior de cada letra.

Los triggers se registran después de poblar todas las timelines. Sus umbrales numéricos excluyen el `y` animado al medir, de modo que un refresh/resize durante una entrada no desplace la banda. `onRefresh` reconcilia posiciones por encima/debajo de ella y conserva el estado dentro: cubre scroll restaurado, saltos y resize sin reinicios innecesarios.

Se conserva el contexto con `revert()`, limpieza de hover y recuperación local. Reduced motion revierte las animaciones y muestra todo, sin hover; al habilitar movimiento se crea un único conjunto. El HTML/no-JS permanece visible. El fallback tiene el alcance local descrito en [el informe anterior](RIGHT_NOW_MOTION.md); no recupera un desmontaje global de React o del motor compartido.

## Pruebas

Chromium/Playwright en desarrollo con Strict Mode, a **390, 768, 1024 y 1440 px**:

- Los 12 grupos completan dos entradas y una inversión completa por grupo, con muestreo monotónico de opacidad durante la inversión. Al llegar a cero permanecen ocultos, sin destello.
- Oscilaciones a ambos lados del 92% y dentro de la banda mantienen el playhead final y el texto visible.
- Saltos de Hero al final y vuelta, incluida una inversión interrumpida por reentrada rápida: ningún grupo queda oculto cuando corresponde mostrarlo.
- Hover y retorno en la capa interior; táctil emulado sin hover; resize durante la inversión.
- Tres desmontajes/remontajes por ancho: 12 triggers → 0 → 12, sin tweens sobre nodos retirados ni listeners de hover acumulados. Cambios dinámicos de reduced motion: 0 triggers, todo visible; vuelta a movimiento: 12.
- Sin errores de página o hidratación observados en los recorridos normales.

El fixture temporal de inspección se retira antes del build; no se añade una ruta de prueba al sitio. Scripts y resultados: `/workspace/work/portfolio-v2-reversible-glow/`, con [resumen versionado](assets/reversible-reveals/results.json).

Validaciones de este cambio: `npm run lint` termina con código 0, sin errores y con las mismas 21 advertencias de imágenes; `npx tsc --noEmit`, `npm run build` y `git diff --check` terminan con código 0. El build conserva las cuatro rutas estáticas habituales. La comparación final de geometría y la validación conjunta se registran junto a la implementación de [OpenChannel](CONTACT_AMBIENT_GLOW.md).

Pendientes: valoración del ritmo en preview, Safari/Firefox y dispositivos físicos. La nueva política sigue limitada a RightNow; no cambian las animaciones del resto de secciones, los tres pins o Lenis.
