# Portfolio V2 — implementación profesional, IA y contacto

Continuación aprobada de motion design en RightNow: ver [timelines, hover, cleanup y validaciones](RIGHT_NOW_MOTION.md). El informe siguiente conserva el registro de la implementación editorial anterior.

## Base, alcance y revisión

Implementación desde `feat/portfolio-v2-audit` en `2443026`, sincronizada por fast-forward antes de editar. Se creó `feat/portfolio-v2-implementation` desde ese HEAD. Se revisaron `AGENTS.md`, `README.md`, `TECHNICAL_AUDIT.md`, `PORTFOLIO_V2_AUDIT.md`, los commits remotos y los componentes reales.

Se conservan las decisiones del propietario: columnas de WhoAmI alineadas al inicio, separación de etiquetas/valores del PR #3 y `text-[15vw]` en TradeMate, Vape Mate, Hookah GT y Hookah Partner sin reintroducir tamaños redundantes. Un chequeo comparó las clases de esos títulos contra `2443026` y confirmó que no cambian. El PR #3 permanece como base de auditoría; el nuevo PR debe dirigirse a esa rama, no a main.

La implementación incorpora contenido profesional expresamente confirmado por el propietario y una interfaz de contacto identificada como demostración. No se activó correo, proveedor, endpoint de envío ni credenciales. No hay nuevas secciones con pin, dependencias de aplicación, migración de imágenes o cambios de configuración de Vercel. No se fusiona ningún PR ni se publica manualmente.

## Funcionalidades y decisiones

### Posicionamiento, WhoAmI y semántica

- Hero conserva composición, retrato y animación. El descriptor pasa a «Desarrollo full-stack · eCommerce · integraciones». El H1 tiene nombre accesible «Isaías Frutos» y el apellido mantiene su aspecto mediante un párrafo animado con el mismo ref. La timeline de Hero se comparó con la base y es idéntica.
- Manifesto corrige «haz» por «has». Se mantienen cuatro líneas, el mismo número de palabras, márgenes a la izquierda y recorrido del pin.
- WhoAmI corrige «Quién soy» y organiza nueve filas técnicas: enfoque, frontend, backend, datos, integración, eCommerce/CMS, flujos, IA aplicada y diseño. Introduce PHP, Python y Power Automate confirmados y describe IA como revisión/validación, sin crear una lista ilimitada de tecnologías. Conserva las nueve filas personales: los 18 targets de reveal y la secuencia de `useWhoAmIReveal` no cambian.
- Se conserva el grid de 7rem/minmax y gaps 24/28 px, sin `md:justify-center`. El encabezado de sección es H2 y las tablas H3; los proyectos del rail son H3 bajo un H2 accesible. Los casos abiertos usan H2 y la navegación utiliza spans, sin encabezados falsos dentro de botones. Hay un único H1, tanto con overlay cerrado como abierto.
- Metadata se alinea con desarrollo full-stack, eCommerce, plataformas e ingeniería asistida. Canonical, `es-MX`, robots y sitemap siguen con `isaiasfrutos.dev`. No se asigna una imagen OG inexistente.

### UIC y AI-Assisted Engineering & Automation

RightNow mantiene el título editorial «PERFIL ACTUAL» y utiliza flujo natural para dos bloques, sin añadir triggers o animaciones:

1. **Web Master Institucional — Universidad Intercontinental**, Comunicación Social, desde el **18 de agosto de 2026**, actualmente laborando. Describe desarrollo/mantenimiento de plataformas y landings, WordPress/PHP/HTML/CSS/JS, formularios/CRM/servicios, diagnóstico, gestión técnica de CMS y coordinación/documentación entre áreas.
2. **AI-Assisted Engineering & Automation**, con el recorrido **Problema → Implementación → Validación**. Explica el apoyo de ChatGPT y Codex para análisis, planificación, refactorización y documentación, junto a pruebas, GitHub y CI. Incluye ejemplos de scripts Python/PHP para actualizaciones/inventarios/auditorías y Power Automate para correos/adjuntos con prevención de duplicados.

No se atribuye entrenamiento de modelos, ML, agentes autónomos, métricas de ahorro ni responsabilidad global de infraestructura/ciberseguridad. Tampoco se muestran datos, endpoints o materiales internos de la universidad. El contenido se basa en la confirmación del propietario, no en una inspección de sus sistemas institucionales.

La nueva sección es más alta: los bloques profesionales y el contacto añaden contenido en flujo después del rail. Esto cambia la altura total y la posición del footer, no el `scrub`, end, duraciones o easing de los pins existentes. El título institucional se ajustó específicamente para evitar un desbordamiento detectado a 1024 px.

### Siete casos de estudio

Se revisan panel, Hero, Story y Feature de TradeMate, TryFüm, ONDA, Sectra Visión, Vape Mate, Hookah GT y Hookah Partner. Los relatos pasan a contexto, participación y trabajo de implementación; los enlaces existentes sirven como referencia pública, no como prueba de resultados de conversión. Los resúmenes reducen promesas repetidas sobre crecimiento, escalabilidad o rendimiento y se centran en catálogo, producto, integración, CMS y contenido según el material existente.

Se mantienen orden, slugs, tecnologías de las listas, roles originales, años, estados y URLs. Un chequeo de los archivos de casos contra la base confirma que años, enlaces y etiquetas «EN OPERACIÓN» permanecen iguales. Se normalizan las etiquetas de navegación a español y los nombres visibles según la lista proporcionada por el propietario; no se cambian los identificadores de proyecto.

Continúan pendientes de confirmación antes de modificarlos: ONDA 2026 en Hero frente a 2025 en Story/Feature; Shopify Plus en TradeMate; relación del caso Sectra con el enlace existente; estado de Vape Mate; resultados comerciales y permisos de material externo. El CV sigue requiriendo una versión editable/aprobada para actualizar su dominio y experiencia.

### Formulario de demostración

OpenChannel conserva email, enlace al sitio, CV, GitHub, Instagram y WhatsApp como alternativas funcionales. Su nuevo copy explica el tipo de consulta. La dirección de correo se muestra sin ellipsis y se acotó a su columna; el `className` se normalizó a una sola cadena, resolviendo el warning de hidratación previamente observado allí.

`ContactForm` ofrece nombre, correo, tipo y mensaje. Sus límites son nombre 2–100 caracteres, email válido de hasta 254, tipo de una lista cerrada y mensaje 20–3000. El estado pendiente usa «Validando…»; la acción real es **«Revisar consulta»**, no «Enviar». La validación es local e inmediata, sin esperas artificiales ni solicitudes de red. El resultado indica explícitamente que los datos se revisaron y que **no se envió un mensaje**.

Los campos son controlados. Se cancela el reset automático del formulario de React para que el select y los valores no se pierdan tras una revisión. Cambiar datos después de validarlos invalida el aviso de revisión anterior. Se mantiene foco en el primer error y se anuncia el resultado mediante `role="status"`. Los labels son persistentes y los mensajes están asociados por `aria-describedby`; se incluyen límites visibles y foco de teclado.

Los datos solo existen en memoria de la página: sin fetch, API, localStorage, analítica de campos o registro de mensajes. Sin JavaScript, se oculta la demo y se mantienen el email y contenido principal. No se presenta una confirmación de envío ficticia ni se promete un plazo de respuesta.

La propuesta histórica de backend se sustituyó por Web3Forms directo desde el navegador. Ver [configuración vigente](CONTACT_DELIVERY_SETUP.md).

### Accesibilidad y estabilidad

- Cada panel tiene un botón real que ocupa su área interactiva. Enter/Espacio funcionan sin fingir que una sección es un botón. Al enfocar con teclado se muestra el panel mediante su ScrollTrigger existente; no se cambia su configuración. Se evita el desplazamiento horizontal nativo de la caja del rail al mover el foco.
- El shell tiene `role="dialog"`, nombre del caso y `aria-modal`. Tab/Shift+Tab permanecen en controles visibles del diálogo; al cambiar de caso el foco vuelve al control de cierre si desaparece el botón que lo tenía. Escape conserva la reversa GSAP original. Al cerrar se restaura el trigger, evitando que esa restauración reposicione el rail.
- El enlace flotante mantiene su posición y cambia «Contact Me» por «Hablemos». Queda inert mientras el overlay pausa la página para no introducir una interacción externa al modal.
- Cursor personalizado solo en puntero fino con hover; inputs/textarea mantienen cursor de texto y select conserva cursor nativo. Se añaden contornos de foco y se oculta el cursor decorativo en punteros táctiles.
- Con reduced motion, el scroll nativo pasa a `auto`. Las timelines de GSAP y Lenis no se reescriben: su adaptación completa requiere una propuesta separada para conservar el rail y los pins. No se declara resuelta toda la accesibilidad del movimiento.

## Commits por funcionalidad

| Commit | Cambio |
| --- | --- |
| `05ee080` | Posicionamiento, capacidades, semántica y relatos de casos |
| `2d8b541` | Experiencia UIC y método asistido en RightNow |
| `cb22bd2` | Demo de contacto, validación y pruebas unitarias |
| `d44e7b8` | Botones de proyectos, foco modal y controles de interacción |
| `3e368d7` | Ajuste de título institucional y semántica de navegación |
| `bede78a` | Retención de datos de la demo, revisión caducada y email |
| `0277d3a` | Resúmenes de proyectos centrados en implementación |
| `8a79eb5` | Etiquetas y nombres consistentes en navegación |
| `0363143` | CI para PR dirigidos a la rama audit y prueba del formulario |

La CI anterior solo escuchaba PR a main. Se amplía el filtro a `feat/portfolio-v2-audit` para que este PR apilado pueda ejecutar lint, TypeScript, test de validación y build. No cambian permisos (`contents: read`), secretos o despliegues. Los resultados remotos se deben consultar por separado de los locales.

## Archivos modificados

| Grupo | Archivos |
| --- | --- |
| Secciones | `src/sections/Hero.tsx`, `Manifesto.tsx`, `WhoAmI.tsx`, `ProjectsRail.tsx`, `RightNow.tsx`, `OpenChannel.tsx` |
| App | `src/app/layout.tsx`, `page.tsx`, `globals.css` |
| Contacto | `src/components/contact/ContactForm.tsx`, `src/lib/contact.ts`, `tests/contact.test.mjs` |
| Acceso y foco | `src/components/projects/ProjectOpenButton.tsx`, `overlay/ProjectDetailShell.tsx`, `overlay/ProjectOverlayHost.tsx`, `navigation/CaseStudyNavigator.tsx` |
| Controles generales | `src/components/system/CustomCursor.tsx`, `src/components/WhatsAppButton.tsx`, `src/data/caseStudies.ts` |
| Siete paneles | `src/components/projects/panels/ProjectPanel{TradeMate,TryFum,Onda,SectraVision,VapeMate,HookahGt,HookahPartner}.tsx` |
| Casos | Hero, Story y Feature de cada directorio `src/components/projects/case-studies/{trademate,tryfum,onda,sectravision,vapemate,hookahgt,hookahpartner}/` |
| Validación y documentación | `.github/workflows/ci.yml`, este informe, referencia desde `PORTFOLIO_V2_AUDIT.md` y capturas de revisión |

No forman parte del diff `src/hooks/`, `src/animations/`, `Preloader.tsx`, `IntroPreloader.tsx`, las configuraciones de Lenis, assets de proyectos, package/lockfile, robots o sitemap.

## Validación local

| Comando | Resultado |
| --- | --- |
| `npm run lint` | Código 0: 0 errores, 21 advertencias de imágenes preexistentes |
| `npx tsc --noEmit` | Código 0 |
| `npm run build` | Código 0: `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml` estáticos |
| `git diff --check` | Código 0 |
| `node --experimental-strip-types --test tests/contact.test.mjs` | 5 pruebas pasan: límites, campos ausentes, email inválido/multilínea, tipos de consulta y no mutación |
| HTML generado | Un main sin ocultación del servidor, un H1, contenido UIC/IA/demo prerenderizado, `es-MX` y canonical correctos |

Las pruebas de Node emiten el aviso de detección de módulo ES para el archivo TS en un package sin `type: module`; no se altera la configuración global del proyecto por ese aviso. Local Node 24.22.1/npm 11.9.0. CI usa Node 22 y debe verificarse remotamente antes de integrar.

### Navegador

Chromium/Playwright local contra build optimizado y `next dev` (incluido Strict Mode). Se registran errores de página y mensajes de hidratación, no solo excepciones. Se usaron los puertos locales 3130–3134; un dev anterior del mismo repositorio se detuvo antes de iniciar el nuevo servidor.

| Ancho | WhoAmI (18 filas) | Contenido nuevo | H1 | Pins | Hidratación/página |
| --- | --- | --- | ---: | ---: | --- |
| 390 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |
| 767 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |
| 768 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |
| 771 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |
| 913 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |
| 1024 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |
| 1279 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |
| 1280 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |
| 1440 | Sin colisiones/overflow | Sin overflow | 1 | 3 | Sin errores |

Se verificaron preloader, Hero y Manifesto; geometría de WhoAmI; los siete reveals/casos; RightNow; OpenChannel y formulario. Se conserva alineación izquierda de Manifesto y gaps 24/28 px del perfil. La altura total observada es 18257 px desktop 1440×900 y 13462 px móvil 390×844, por el contenido profesional/contacto añadido en flujo.

- Regresión desktop/móvil: apertura, cierre, reapertura, ráfaga de navegación, cierre durante apertura/fade, tres Escape consecutivos, resize dentro del rail y con overlay abierto. Los siete paneles terminan en su posición y opacidad esperadas; sin bloqueos.
- Scroll interno no mueve el fondo; al cerrar se recupera Lenis. Rueda de 500 px vuelve a producir 450 px con el multiplicador existente.
- Teclado: los siete paneles reciben foco y se muestran; Enter abre el caso, Tab/Shift+Tab ciclan, navegación entre casos mantiene foco modal y Escape restaura trigger/posición.
- Demo: cuatro campos ausentes anuncian errores y enfocan nombre; datos parciales permanecen; email inválido recibe foco; una revisión válida se anuncia como revisión sin envío. Editarla exige revisar de nuevo. Se observaron **cero POST/fetch/XHR** durante la prueba de formulario, tanto desktop como móvil táctil emulado.
- Sin JavaScript: main, UIC/IA y correo disponibles; capa de carga, demo y controles de proyectos que requieren JS ocultos. No se promete interacción de overlays sin JS.
- Reduced motion: se verificó el recorrido y teclado; scroll nativo `auto`. Las animaciones GSAP siguen con la política previa.

### Rendimiento: alcance de las observaciones

Una muestra local sin throttling registró LCP candidato `SPAN` a 724 ms desktop y 404 ms móvil, y CLS 0 en ambas. Son entradas de PerformanceObserver, no datos de campo ni una certificación de carga del Hero o de finalización del preloader. No hay comparación normalizada antes/después ni medición de INP. No se ejecutó Lighthouse en esta entrega. Se debe medir con red/CPU reproducibles y en preview antes de decidir cambios sobre la experiencia cinematográfica.

Las 21 advertencias de `<img>` se conservan. No se migra masivamente a next/image, no se añaden imágenes OG inexistentes y no se modifica el scroll para mejorar una puntuación hipotética.

## Riesgos y siguiente iteración

1. Revisar copy, jerarquía y composición en preview: la ampliación de RightNow/contacto aumenta la lectura vertical y puede requerir ajustes editoriales posteriores.
2. Safari/iOS, Firefox, móvil real/teclado virtual, zoom, lectores de pantalla y evaluación completa de foco/movimiento permanecen pendientes. Los viewports emulados no equivalen a esos dispositivos.
3. Diseñar una política completa de reduced motion para GSAP/Lenis/pins sin perder acceso a proyectos; no resolverlo desactivando librerías de forma indiscriminada.
4. Comprobar métricas de campo/laboratorio y costes de imágenes antes de optimizar. La muestra local no prueba una mejora de Web Vitals.
5. Confirmar los datos de proyectos y el CV indicados arriba; no se inventan resultados ni se cambian fechas/estados pendientes.
6. Aprobar destinatario, proveedor, privacidad y antispam antes de implementar un backend. El formulario actual no sirve para enviar una consulta real y así lo indica en pantalla; los canales directos continúan disponibles.
7. Las pruebas cubren Strict Mode y recorridos, pero no una auditoría exhaustiva de listeners/RAF o memoria tras todas las combinaciones de navegación e historial.

Scripts, JSON, logs y capturas de los nueve anchos están en `/workspace/work/portfolio-v2-implementation/`, con `regression/`. Una selección visual para revisión se incorpora a documentación; no contiene mensajes reales ni datos institucionales privados.

### Capturas para revisión editorial

Capturas del build optimizado, con el formulario vacío y sin datos personales de prueba. Las imágenes muestran las secciones completas; el botón flotante conserva su posición de viewport.

| Sección | Escritorio (1440 px) | Móvil (390 px) |
| --- | --- | --- |
| Experiencia y método | [Ver captura](assets/portfolio-v2-implementation/experience-desktop.png) | [Ver captura](assets/portfolio-v2-implementation/experience-mobile.png) |
| Contacto y demo | [Ver captura](assets/portfolio-v2-implementation/contact-desktop.png) | [Ver captura](assets/portfolio-v2-implementation/contact-mobile.png) |

## Entrega en GitHub y preview

Los cambios se guardaron en commits por funcionalidad y se subieron a `feat/portfolio-v2-implementation`. El [PR #4](https://github.com/Isaias-Web/isaiah-portfolio/pull/4) está en borrador hacia `feat/portfolio-v2-audit`, sin conflictos al abrirlo. El PR #3 continúa separado y no se fusionó ninguno.

La integración automática de Vercel emitió estado **Ready** para la [preview de revisión](https://isaiah-portfolio-git-feat-po-b4f4e1-isaiahweb333-8083s-projects.vercel.app). No se ejecutó ningún despliegue manual ni se cambiaron sus opciones.

El intento de smoke test remoto desde Chromium en este entorno falló antes de cargar la página con `net::ERR_TUNNEL_CONNECTION_FAILED`. Por tanto, no se afirma una validación visual de esa URL: las pruebas detalladas arriba corresponden a los servidores locales de desarrollo/build. Revisar la preview desde un navegador con acceso sigue pendiente. La CI remota se consulta en [Portfolio CI](https://github.com/Isaias-Web/isaiah-portfolio/actions/workflows/ci.yml) y en los checks del PR; sus resultados son independientes de la validación local.
