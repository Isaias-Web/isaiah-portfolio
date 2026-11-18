# Contacto — Web3Forms

El navegador envía `FormData` por `fetch` a `https://api.web3forms.com/submit`. No hay endpoint propio, SDK de correo ni widget externo. Se retiraron la ruta anterior, sus switches, credenciales e instrucciones. El diseño de los cuatro campos, validaciones y glow permanecen intactos.

## Activación

1. En tu cuenta Web3Forms, verifica que la Access Key corresponda a **isaiahweb333@gmail.com**. El destinatario se resuelve en el proveedor; el navegador no envía un campo `to` ni decide el buzón. `email` se usa como dirección de respuesta del visitante.
2. Configura `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` en `.env.local` para desarrollo o en las variables de **Preview** del proyecto. `.env.example` deja el valor vacío: sin configuración el botón permanece deshabilitado y el correo directo disponible.
3. Reconstruye la aplicación/preview después de cambiar la variable. Next.js incorpora `NEXT_PUBLIC_*` en el bundle: esta Access Key es pública por diseño del proveedor; no es una clave secreta de servidor. No escribir valores reales en commits, documentación, capturas o logs.
   Un commit nuevo en `feat/contact-email-delivery` también inicia automáticamente un despliegue **Preview** en Vercel; confirma que el despliegue resultante sea posterior a la configuración de la variable y aparezca como **Ready**.
4. Retira de la configuración externa las variables antiguas que ya no usa esta rama. No se cambiaron automáticamente los ajustes de Vercel.
5. Desde la preview configurada, realiza **una prueba controlada** y confirma recepción en Gmail, carpeta spam y respuesta al visitante. `success: true` significa aceptación del proveedor; no garantiza llegada a bandeja principal. **No fusionar a main ni publicar antes de esa comprobación.** En esta entrega solo se usan mocks y no se generan correos reales.

No necesitas verificar un remitente con DNS, configurar un backend o instalar un CAPTCHA de pago.

## Envío y errores

Se conserva nombre 2–100, email válido hasta 254 caracteres, consulta de lista cerrada y mensaje 20–3000. El guard síncrono evita doble envío, incluso antes del render de pending. Los cuatro valores permanecen durante la espera, con controles temporalmente deshabilitados. No hay reintentos automáticos.

Solo una respuesta HTTP correcta y JSON con `success === true` limpia los campos y muestra el aviso por portal a body, fijo arriba a la derecha y respetando safe areas. El aviso tiene entrada/salida de 200 ms, cierre manual accesible y comienza a salir a los cinco segundos; desaparece al finalizar la salida. Reduced motion elimina el desplazamiento de esa animación.

HTTP 429 muestra el límite; errores HTTP, JSON inválido, `success: false`, respuestas ambiguas o red fallida conservan los datos y permiten reintentar. Hay timeout de 20 segundos y cancelación al desmontar. Un fallo de red después de aceptar la solicitud puede dejar entrega incierta: se advierte revisar antes de reintentar para evitar duplicados. No se imprimen respuestas del proveedor, claves o mensajes en consola.

## Antispam y privacidad

Se usa el filtro integrado de Web3Forms y su checkbox `botcheck`, oculto, sin foco ni impacto visual. Si está marcado, se rechaza localmente sin fingir éxito. La guía oficial advierte que el honeypot es antiguo y menos efectivo: **no se presenta como protección completa**, ni como un rate limit propio. Las cuotas y filtros los controla Web3Forms. No se añade ningún servicio extra; si aparece abuso, evaluar por separado el CAPTCHA compatible que el proveedor ofrece para el plan gratuito. Las restricciones de dominio y otras protecciones pueden depender del plan; no se presuponen activadas.

La nota visible informa que Web3Forms procesa los datos para responder y pide evitar información confidencial. El portfolio no guarda mensajes en localStorage, base de datos o logs. Revisar las condiciones de privacidad del proveedor antes de activar; no se promete ausencia de registros del lado del proveedor.

## Pruebas de esta entrega

Resultados detallados y límites: [CONTACT_WEB3FORMS_VALIDATION.md](CONTACT_WEB3FORMS_VALIDATION.md). Los mocks interceptan el dominio oficial y usan una configuración ficticia solo en el proceso de pruebas. No se usa ni registra una Access Key real. Gmail permanece pendiente de verificación manual.

## Fuentes oficiales revisadas

- [API y códigos de respuesta](https://docs.web3forms.com/getting-started/api-reference)
- [React y FormData](https://docs.web3forms.com/how-to-guides/js-frameworks/react-js/simple-react-contact-form)
- [Filtro integrado](https://docs.web3forms.com/getting-started/customizations/spam-protection)
- [botcheck y advertencia del honeypot](https://docs.web3forms.com/getting-started/customizations/spam-protection/spam-protection)
- [Access Key pública y privacidad](https://docs.web3forms.com/getting-started/faq)
