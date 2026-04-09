const topItems = [
  {
    label: "ESPECIALIDAD",
    title: "Desarrollo Web & Soluciones Digitales",
    note: "frontend, backend y arquitectura funcional",
  },
  {
    label: "ENFOQUE",
    title: "E-commerce / UX/UI / Integraciones",
    note: "tiendas, sistemas y experiencias digitales",
  },
  {
    label: "STACK",
    title: "JavaScript, React, Node.js, Shopify",
    note: "bases sólidas para productos escalables",
  },
  {
    label: "HERRAMIENTAS",
    title: "Liquid, APIs, Webhooks, WordPress",
    note: "implementación, conexión y optimización",
  },
  {
    label: "UBICACIÓN",
    title: "CDMX",
    note: "disponible para proyectos y colaboración",
  },
];

const bottomItems = [
  {
    label: "ACTUALMENTE",
    title: "Full-Stack Developer & Digital Solutions Architect",
    note: "desarrollo, diseño e integración de sistemas",
  },
];

function RightNowCard({
  label,
  title,
  note,
}: {
  label: string;
  title: string;
  note: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <span className="h-[6px] w-[6px] rounded-full bg-[#ff2d00]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#ff2d00] md:text-[11px]">
          {label}
        </p>
      </div>

      <div className="mt-4 pl-[18px]">
        <p className="font-mono text-[14px] leading-[1.45] tracking-[0.01em] text-[#e8e3db] md:text-[15px]">
          {title}
        </p>
        <p className="mt-1 font-mono text-[12px] italic leading-[1.45] text-white/25">
          {note}
        </p>
      </div>
    </div>
  );
}

export default function RightNow() {
  return (
    <section className="relative overflow-hidden bg-[#090a09] text-white">
      <div className="relative px-6 py-10 md:px-10 md:py-12 lg:px-16 lg:py-14">
        <div className="max-w-[620px]">
          <h2 className="font-black uppercase leading-[0.84] tracking-[-0.07em] text-[#f3efe8] text-[24vw] sm:text-[20vw] md:text-[15vw] lg:text-[13vw]">
            <span className="block">PERFIL</span>
            <span className="block text-[#ff2d00]">ACTUAL</span>
          </h2>
        </div>

        <div className="mt-16 h-px w-full bg-white/10 md:mt-20" />

        <div className="grid gap-x-8 gap-y-10 py-8 md:grid-cols-2 lg:grid-cols-5">
          {topItems.map((item) => (
            <RightNowCard
              key={item.label}
              label={item.label}
              title={item.title}
              note={item.note}
            />
          ))}
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="grid gap-x-8 gap-y-10 py-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            {bottomItems.map((item) => (
              <RightNowCard
                key={item.label}
                label={item.label}
                title={item.title}
                note={item.note}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}