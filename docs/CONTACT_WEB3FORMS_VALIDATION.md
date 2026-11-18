# Web3Forms — implementación y validación

Base remota sincronizada: `feat/contact-email-delivery` en `bf715f1`, PR #5 en borrador hacia main. El árbol estaba limpio; se leyeron AGENTS y la implementación vigente antes de editar.

## Cambios

- `ContactForm.tsx`: fetch multipart directo al endpoint oficial, configuración pública de Access Key, guard síncrono de duplicados, timeout/cancelación, errores seguros, `botcheck`, retención durante espera/fallo y limpieza solo tras HTTP correcto más `success === true`.
- `ContactToast.tsx` y CSS local: portal al body, posición fija con safe areas, colores originales, entrada/salida, cierre a cinco segundos o manual, anuncio accesible y devolución de foco al botón tras cierre por teclado.
- Eliminada `src/app/api/contact/route.ts`, widget/script antispam anterior, variables obsoletas del template e instrucciones del backend. Se actualizan guía vigente y referencias históricas para evitar configuraciones contradictorias.
- `src/lib/contact.ts`: solo cambia el comentario que atribuía validación a la ruta retirada; las validaciones y sus cinco pruebas se conservan.
- No se modifican OpenChannel, su glow, cursor, GSAP, Lenis, enlaces ni otros componentes del portfolio.

## Resultados

| Comando | Resultado |
| --- | --- |
| `npm run lint` | Código 0: 0 errores, 21 advertencias de imágenes preexistentes |
| `npx tsc --noEmit` | Código 0 |
| `npm run build` | Código 0; cuatro rutas estáticas, sin API de contacto |
| `git diff --check` | Código 0 |
| `node --experimental-strip-types --test tests/contact.test.mjs` | Cinco pruebas aprobadas |

Chromium local/Playwright, desktop 1440×900 y móvil táctil emulado 390×900, contra desarrollo con configuración ficticia. Todas las solicitudes a Web3Forms se interceptaron: **ningún correo real**. [Resumen de resultados](assets/contact-web3forms/results.json).

- Campos requeridos y foco en el primero inválido; validación original conservada.
- Dos eventos de submit inmediatos producen una sola petición multipart. Durante respuesta lenta permanecen los valores y los controles impiden cambios; botón ENVIANDO... y estado ocupado.
- Únicamente HTTP correcto y booleano `success: true` limpian los cuatro campos y muestran el toast. `success: false`, el string `"true"`, JSON inválido, HTTP 429/500 y error de red no lo muestran y conservan valores; se permite recuperación posterior.
- Portal directamente bajo body, límites del viewport, posición fija al hacer scroll, cierre automático a los cinco segundos más salida de 200 ms y cierre manual con Enter/foco restaurado.
- Honeypot marcado impide petición sin fingir éxito; sin overflow, errores de página o hidratación observados. Se mantienen los tres pins.
- Build sin clave: botón deshabilitado; `/api/contact` responde 404. Sin JS se oculta el formulario y queda el enlace de correo.

La suite reproducible está en `tests/contact-web3forms.browser.mjs`: requiere Playwright y Chromium en el entorno de pruebas, sin añadir dependencias de producción. Ejecutar contra un dev server configurado con un valor ficticio en `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`; usar `TEST_URL` para elegir servidor y `REPORT_PATH` opcional para guardar solo resultados, sin claves ni mensajes. Logs de esta ejecución en `/workspace/work/contact-web3forms/`.

## Pendientes y límites

No se configuró una clave real ni se cambiaron variables externas de Vercel. La preview queda desactivada si no recibe esa variable pública durante el build. Activación y fuentes oficiales: [guía de configuración](CONTACT_DELIVERY_SETUP.md).

Pendientes: configuración de Preview, una entrega controlada a Gmail (incluido spam/reply-to), Safari/Firefox, dispositivos físicos y comprobación de cuotas/antispam reales. Los mocks prueban el contrato y la interfaz, no garantizan entrega del proveedor. El honeypot es una medida limitada y desaconsejada por la documentación actual como defensa principal; se mantiene el filtro integrado, sin instalar CAPTCHA o servicios adicionales.

El timeout o una pérdida de red no permiten saber si el proveedor aceptó antes de cortarse la conexión: no se reintenta automáticamente y el mensaje pide comprobar antes de reintentar. No hay logs de payload ni eco de mensajes del proveedor. No se hace merge ni publicación en producción.
