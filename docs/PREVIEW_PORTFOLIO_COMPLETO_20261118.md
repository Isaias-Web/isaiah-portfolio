# Vista integral del portfolio — 18 de noviembre de 2026

Esta rama de **Preview** fue creada desde `main` después de fusionar los cambios revisados:

- PR #3: auditoría SEO y estructura inicial.
- PR #4: Portfolio V2 (experiencia UIC, IA, movimiento, glow y contacto).
- PR #6: títulos de WhoAmI equilibrados en escritorio.
- PR #7: cursor con leyenda y brillo de fondos al hover.
- PR #5: formulario Web3Forms con validación y aviso temporal.

No añade cambios visuales ni funcionales al código de `main`. Este archivo sirve únicamente para disparar una nueva compilación Preview y distinguir la revisión integral de los despliegues individuales.

**Envío de mensajes:** requiere `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` configurada en el entorno Preview correspondiente. El correo a Gmail fue verificado manualmente en la preview de `feat/contact-email-delivery`. El envío desde Production requiere configurar esa variable también allí y ejecutar un nuevo despliegue.
