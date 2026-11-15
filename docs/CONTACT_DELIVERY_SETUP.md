# Formulario de contacto — configuración y activación

## Estado actual

La rama `feat/contact-email-delivery` implementa una API de Next.js (`POST /api/contact`), un formulario real y una notificación de éxito fija en la esquina superior derecha. **Por defecto el envío queda desactivado** hasta configurar las credenciales; el correo directo sigue funcionando. No realizar merge antes de probar una entrega real.

El destinatario está fijado en el servidor a **isaiahweb333@gmail.com**. El visitante nunca determina el destinatario ni la dirección remitente. El formulario envía nombre, correo, tipo de consulta y mensaje, en texto plano; el correo del visitante se usa como `reply_to`.

## 1. Proveedor de envío (Resend)

1. Crea una cuenta en [Resend](https://resend.com) y agrega `isaiasfrutos.dev` como dominio remitente (o un subdominio específico, por ejemplo `mail.isaiasfrutos.dev`).
2. Completa la verificación del dominio en Resend. Agrega los registros DNS SPF/DKIM que el proveedor te indique en Vercel DNS. **No sustituyas los MX de un servicio de correo existente.**
3. Crea una API key limitada a envío, de preferencia restringida al dominio.
4. Usa un remitente del dominio verificado, por ejemplo `Portfolio Isaías <contacto@isaiasfrutos.dev>`. No uses la cuenta Gmail del destinatario como dirección `from` sin verificar su dominio.

## 2. Protección antispam (Cloudflare Turnstile)

1. Crea un widget de Turnstile en [Cloudflare](https://dash.cloudflare.com) para `isaiasfrutos.dev` (agrega direcciones de prueba solo si las utilizarás).
2. Obtén `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (pública) y `TURNSTILE_SECRET_KEY` (privada).
3. El backend valida **cada token** por el endpoint Siteverify y exige acción `contact` y hostname coincidente con la página de origen. Tokens vencidos o reutilizados se rechazan.
4. Además hay un honeypot, validación de origen, tamaño máximo de petición y validación de campos en servidor. Para un lanzamiento público, configura límites de solicitudes en Vercel Firewall/WAF o en un servicio con estado compartido y supervisa el abuso. Turnstile no sustituye el rate limit.

## 3. Variables de entorno en Vercel

En el proyecto **isaiah-portfolio → Settings → Environment Variables**, configura:

| Variable | Ejemplo / valor | Visibilidad |
| --- | --- | --- |
| `CONTACT_ENABLED` | `true` para activar | Servidor |
| `NEXT_PUBLIC_CONTACT_ENABLED` | `true` para activar el botón | Pública |
| `RESEND_API_KEY` | Clave de Resend | Secreta, servidor |
| `CONTACT_FROM_EMAIL` | `Portfolio Isaías <contacto@isaiasfrutos.dev>` | Servidor |
| `TURNSTILE_SECRET_KEY` | Clave privada del widget | Secreta, servidor |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clave pública del widget | Pública |
| `CONTACT_ALLOWED_ORIGINS` | Opcional: URLs exactas de previews adicionales separadas por coma | Servidor |

No pegues contraseñas ni claves en commits, capturas, chats o `.env.example`. Las dos variables `NEXT_PUBLIC_*` se incluyen en el build cliente; **se necesita un nuevo despliegue tras cambiarlas**.

`POST /api/contact` devuelve 503 sin enviar nada si faltan claves o si `CONTACT_ENABLED` no está en `true`.

## 4. Comprobaciones antes de producción

1. Completar la verificación DNS del remitente y de Turnstile.
2. Configurar variables en Preview en un entorno controlado y hacer un nuevo despliegue.
3. Enviar una consulta real desde el formulario y confirmar recepción en `isaiahweb333@gmail.com`; verificar spam y que `reply-to` sea el visitante.
4. Probar datos incompletos, correo inválido, token vencido/reutilizado, honeypot, error de Resend, conexión lenta y doble envío. **No debe aparecer la notificación de éxito ante un fallo.**
5. Verificar notificación en móvil y escritorio: arriba a la derecha, `position: fixed`, cierra manualmente o desaparece tras 5 segundos.
6. Revisar accesibilidad, privacidad y política de tratamiento de datos antes de recopilar consultas reales. El proveedor de correo puede procesar o retener datos según sus condiciones.
7. Activar reglas de abuso/rate limit y comprobar las condiciones de uso del plan de Vercel. Hobby está sujeto a uso personal no comercial; un formulario para captar servicios remunerados puede requerir Pro.

No modificar `main` ni desplegar en producción hasta que el usuario apruebe la prueba de correo y las condiciones operativas.

## Referencias

- [Resend — envío por API](https://resend.com/docs/api-reference/emails/send-email)
- [Cloudflare Turnstile — validación en el servidor](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Turnstile — embed](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Vercel Hobby — límites](https://vercel.com/docs/plans/hobby)
