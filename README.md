# Isaías Frutos — Portfolio

Portfolio personal de Isaías Frutos: desarrollo web, soluciones digitales y eCommerce.

**Producción:** https://isaiasfrutos.dev  
**Repositorio:** https://github.com/Isaias-Web/isaiah-portfolio

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- GSAP y ScrollTrigger para animaciones
- Lenis para smooth scroll
- Vercel para despliegue continuo

## Desarrollo local

Requisitos: Node.js compatible con Next.js 16 y npm.

```bash
git clone https://github.com/Isaias-Web/isaiah-portfolio.git
cd isaiah-portfolio
npm ci
npm run dev
```

Abrir http://localhost:3000.

## Validaciones antes de publicar

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Estas comprobaciones deben ejecutarse localmente; la existencia de los comandos no supone que ya hayan pasado.

## Estructura principal

- `src/app/`: layout, página principal, estilos globales y metadatos SEO.
- `src/sections/`: secciones narrativas del portfolio (Hero, Manifesto, WhoAmI, ProjectsRail, RightNow, OpenChannel).
- `src/components/`: interfaz, preloader, cursor y smooth scroll.
- `src/animations/` y `src/hooks/`: animaciones y hooks reutilizables.
- `public/`: imágenes, archivos y recursos estáticos.

## Flujo Git y Vercel

1. Mantener `main` como rama de producción.
2. Crear una rama por ajuste: `feature/...`, `fix/...` o `chore/...`.
3. Revisar cambios y ejecutar las validaciones.
4. Subir la rama y revisar el Preview Deployment de Vercel.
5. Abrir Pull Request hacia `main` y fusionar solamente tras validar.
6. Vercel despliega automáticamente los cambios integrados a la rama de producción.

No incluir secretos, archivos `.env` ni credenciales en los commits.

## SEO y dominios

- Dominio canónico: `https://isaiasfrutos.dev`.
- `https://www.isaiasfrutos.dev` redirige con 308 al dominio principal (configurado en Vercel).
- Los metadatos globales están en `src/app/layout.tsx`.
- `src/app/robots.ts` genera `/robots.txt`.
- `src/app/sitemap.ts` genera `/sitemap.xml`.

La [auditoría de rendimiento V2](docs/PORTFOLIO_V2_PERFORMANCE_AUDIT.md) verifica el HTML inicial, SEO y recorridos locales de teclado. Quedan pendientes métricas de campo, movimiento reducido global, revisión remota de producción y una imagen Open Graph personalizada. La [migración de imágenes](docs/IMAGE_OPTIMIZATION_INVENTORY.md) tiene inventario y plan, sin sustituciones de assets.

## Contacto

Consultar el apartado de contacto del portfolio.
