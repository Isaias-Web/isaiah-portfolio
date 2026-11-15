# OpenChannel — interactive ambient glow

Segunda parte de la entrega sobre `feat/portfolio-v2-implementation`, PR #4. La primera es [RightNow reversible](RIGHT_NOW_REVERSIBLE.md), commit `28fbc64`. Se conserva el contenido y la composición previamente aprobados.

## Implementación

- `src/hooks/useContactGlow.ts`: espera `introReady` y habilita la interacción únicamente con hover, puntero fino y movimiento permitido. Ignora entradas táctiles incluso en dispositivos híbridos.
- `src/sections/OpenChannel.tsx`: añade un ref y una sola capa absoluta decorativa con `aria-hidden`, `pointer-events: none` y z-index 0. El contenido mantiene su posición y queda en z-index 10 dentro de un contexto aislado y recortado. El fondo sigue siendo `#090a09`.
- El gradiente radial permanece estático: naranja derivado de `#ff2d00`, alfa central 0.13, 0.055 al 32%, 0.018 al 52% y transparente al 72%. Diámetro `min(64rem, 120vw)`, sin borde definido, blur de pantalla, canvas o WebGL.
- Solo se animan transform y opacity. Tres `gsap.quickTo` reutilizables: X/Y a 0.65 s con `power3.out`, fade a 0.55 s con `power2.out`. No se crea una animación por evento ni se usa estado React o un bucle RAF propio.
- Al entrar se coloca la luz mientras está invisible y aparece gradualmente. Si se vuelve durante la salida, continúa desde la posición y opacidad actuales. Al salir, cancelar el puntero o perder foco se desvanece.
- Scroll/resize recalculan la posición relativa únicamente mientras el puntero está dentro; sus tres listeners temporales se retiran al salir. El contexto revierte tweens, estilos y cuatro listeners de puntero al desmontar o cambiar la preferencia. Un fallo de setup deja la decoración apagada y el formulario disponible.

La capa solo existe dentro de OpenChannel. No se añade otro cursor, no hay listener global de movimiento y no se modifica el cursor personalizado existente. No cambian `ContactForm`, su validación, datos, navegación, mensajes o alternativas de contacto. Continúa siendo una demostración sin envío.

## Validación conjunta

| Comando | Resultado |
| --- | --- |
| `npm run lint` | Código 0: 0 errores y 21 advertencias preexistentes de imágenes |
| `npx tsc --noEmit` | Código 0 |
| `npm run build` | Código 0; `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml` estáticos |
| `git diff --check` | Código 0 |

Chromium/Playwright local en desarrollo con Strict Mode, más regresión sobre el build optimizado. Los fixtures de inspección se eliminaron antes del build; no se publica ninguna ruta de prueba ni se añaden dependencias.

| Ancho | RightNow: 12 grupos reversibles | Glow | Formulario | Geometría/overflow |
| --- | --- | --- | --- | --- |
| 390 | Correcto, reentrada y vuelta a oculto | Apagado en táctil | Correcto | Igual a base / ninguno |
| 768 | Correcto, con histéresis | Seguimiento, fade y cleanup correctos | Correcto | Igual a base / ninguno |
| 1024 | Correcto, con histéresis | Seguimiento, fade y cleanup correctos | Correcto | Igual a base / ninguno |
| 1440 | Correcto, con histéresis | Seguimiento, fade y cleanup correctos | Correcto | Igual a base / ninguno |

### Interacción y recursos

- Movimiento en distintas áreas, interpolación hasta el destino, salida, retorno y pérdida de foco. El centro se reajusta al hacer scroll sin mover el mouse. Resize y cambios dinámicos de reduced motion no acumulan listeners.
- Clics reales, Tab, selección nativa, inputs, select, textarea y botón: correctos. Se probaron los cuatro errores requeridos, foco en nombre, revisión válida, valores conservados y el aviso explícito de que no se envió nada. **Cero POST/fetch/XHR** en estos recorridos.
- Una ráfaga de 500 movimientos sintéticos por ancho con puntero fino produjo **cero commits React adicionales** en el Profiler del contacto y mantuvo un máximo de tres tweens. Es una observación local de asignación/render, no una medición de Core Web Vitals ni una garantía de FPS en todos los dispositivos.
- Tres desmontajes/remontajes por ancho: cero listeners de puntero y tweens propios tras limpiar; los listeners temporales de window vuelven al recuento previo de la aplicación. Strict Mode no duplica los recursos. La inyección de un fallo al crear quickTo apaga el efecto y permite editar el formulario.
- En táctil y reduced motion no se crean tweens o listeners del glow. Sin JavaScript, la capa tiene opacity 0 y el contenido de ambas secciones permanece disponible. Se verificaron estos modos desde la carga a 390 y 1440 px sobre el build.

### Regresión y documento

Respecto a `a8eb9bc`, las alturas del documento/RightNow/OpenChannel y las cajas del formulario y de cada control coinciden exactamente en los cuatro anchos. Los tres pin-spacers conservan posición y dimensiones. Alturas totales: 13462, 14654, 15681 y 18257 px, respectivamente. No hay overflow horizontal observado.

Hero mantiene su hover, Manifesto revela 0/6/12 palabras y WhoAmI sus 18 filas. Los siete paneles/casos pasan apertura, cierre, reapertura, ráfagas, Escape repetido, scroll y resize del rail/overlay; Lenis mantiene 450 px de desplazamiento para rueda de 500. Sin errores de página o hidratación en los recorridos normales. No hay cambios en esas implementaciones, metadata, canonical, idioma, preloader o configuración de Vercel.

El HTML generado conserva un main, seis secciones y un H1. RightNow se emite visible; el glow es decoración oculta y exclusiva de contacto. Las pruebas optimizadas vuelven a comprobar reveal/reverse/reentrada y la ausencia de grupos atascados.

## Evidencias y límites

[Resumen de pruebas](assets/contact-ambient-glow/results.json), [grabación de reentrada y glow](assets/contact-ambient-glow/interaction-demo.webm), [reentrada del título](assets/contact-ambient-glow/title-reentry.png), [contacto sin interacción](assets/contact-ambient-glow/contact-off.png), [glow activo](assets/contact-ambient-glow/contact-on.png) y [contacto móvil](assets/contact-ambient-glow/contact-mobile.png).

Scripts y logs completos: `/workspace/work/portfolio-v2-reversible-glow/`. La comparación visual local mantuvo la intensidad baja y no requirió alterar la composición. Quedan pendientes valoración estética en preview, Safari/Firefox, dispositivos físicos y teclado virtual real. La política de movimiento del resto del sitio sigue intacta; no se afirma una auditoría global de rendimiento o memoria.

La entrega consta de los dos commits solicitados, sin merge, cambios de main, despliegue manual o publicación en producción. La nueva preview procede exclusivamente de la integración automática del PR #4.
