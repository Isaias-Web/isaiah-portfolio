"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { createPortal } from "react-dom";
import {
  inquiryTypes,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact";

const emptyValues: ContactValues = { name: "", email: "", inquiry: "", message: "" };
const inputClass =
  "mt-3 w-full min-w-0 rounded-none border border-white/25 bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-[#f3efe8] placeholder:text-white/35 focus-visible:border-[#ff2d00]";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.18em] text-white/75";

type ContactResult = {
  success?: boolean;
  message?: string;
  errors?: ContactErrors;
};

type TurnstileWindow = Window & {
  turnstile?: { reset: () => void };
};

export default function ContactForm() {
  const enabled =
    process.env.NEXT_PUBLIC_CONTACT_ENABLED === "true" &&
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [successToast, setSuccessToast] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!successToast) return;
    const timer = window.setTimeout(() => setSuccessToast(false), 5000);
    return () => window.clearTimeout(timer);
  }, [successToast]);

  function change(key: keyof ContactValues, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setStatus("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || pending) return;
    const form = event.currentTarget;
    const checked = validateContact(values);
    setErrors(checked);
    setStatus("");

    if (Object.keys(checked).length > 0) {
      const first = Object.keys(checked)[0];
      window.requestAnimationFrame(() => form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
      return;
    }

    const data = new FormData(form);
    const token = data.get("cf-turnstile-response");
    if (typeof token !== "string" || !token.trim()) {
      setStatus("Completa la verificación antispam antes de enviar.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: String(data.get("website") ?? ""),
          turnstileToken: token,
        }),
      });
      const result = (await response.json()) as ContactResult;
      if (!response.ok || result.success !== true) {
        setErrors(result.errors ?? {});
        setStatus(result.message || "No pudimos enviar tu consulta. Intenta de nuevo.");
        return;
      }
      setValues(emptyValues);
      setErrors({});
      setStatus("Consulta aceptada para entrega. Gracias por escribirme.");
      setSuccessToast(true);
    } catch {
      setStatus("No pudimos confirmar el envío. Revisa antes de reintentar o escríbeme por correo.");
    } finally {
      setPending(false);
      (window as TurnstileWindow).turnstile?.reset();
    }
  }

  return (
    <div>
      <noscript>
        <p className="font-mono text-sm leading-relaxed text-white/65">
          Para enviar el formulario necesitas JavaScript. También puedes contactar
          directamente por correo electrónico.
        </p>
      </noscript>

      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        aria-labelledby="contact-form-heading"
        aria-describedby="contact-form-notice"
      >
        <h3 id="contact-form-heading" className="text-2xl font-semibold tracking-[-0.03em]">
          Cuéntame tu proyecto
        </h3>
        <p
          id="contact-form-notice"
          className="mt-3 font-mono text-[12px] leading-[1.8] text-white/65"
        >
          {enabled
            ? "Completa el formulario y envíame tu consulta. Utilizaré tus datos únicamente para responderte."
            : "El envío por formulario está temporalmente desactivado. Puedes escribirme directamente al correo indicado."}
        </p>

        <div className="mt-8 grid min-w-0 gap-6 sm:grid-cols-2">
          <div className="min-w-0">
            <label className={labelClass} htmlFor="contact-name">
              Nombre <span aria-hidden="true">*</span>
            </label>
            <input className={inputClass} id="contact-name" name="name"
              value={values.name} onChange={(event) => change("name", event.target.value)}
              autoComplete="name" required minLength={2} maxLength={100}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            <p id="contact-name-error" className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]">
              {errors.name}
            </p>
          </div>
          <div className="min-w-0">
            <label className={labelClass} htmlFor="contact-email">
              Correo electrónico <span aria-hidden="true">*</span>
            </label>
            <input className={inputClass} id="contact-email" name="email" type="email"
              value={values.email} onChange={(event) => change("email", event.target.value)}
              autoComplete="email" required maxLength={254}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            <p id="contact-email-error" className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]">
              {errors.email}
            </p>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label className={labelClass} htmlFor="contact-inquiry">
              Tipo de consulta <span aria-hidden="true">*</span>
            </label>
            <select className={inputClass} id="contact-inquiry" name="inquiry"
              value={values.inquiry} onChange={(event) => change("inquiry", event.target.value)}
              required aria-invalid={!!errors.inquiry}
              aria-describedby={errors.inquiry ? "contact-inquiry-error" : undefined}
            >
              <option className="bg-[#090a09]" value="">Selecciona una opción</option>
              {inquiryTypes.map((type) => (
                <option className="bg-[#090a09]" key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p id="contact-inquiry-error" className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]">
              {errors.inquiry}
            </p>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label className={labelClass} htmlFor="contact-message">
              Mensaje <span aria-hidden="true">*</span>
            </label>
            <textarea className={inputClass} id="contact-message" name="message" rows={5}
              value={values.message} onChange={(event) => change("message", event.target.value)}
              required minLength={20} maxLength={3000}
              aria-invalid={!!errors.message}
              aria-describedby="contact-message-hint contact-message-error"
            />
            <p id="contact-message-hint" className="mt-2 font-mono text-xs leading-relaxed text-white/50">
              Todos los campos son obligatorios. Mensaje: 20–3000 caracteres.
              Evita incluir información confidencial.
            </p>
            <p id="contact-message-error" className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]">
              {errors.message}
            </p>
          </div>
        </div>

        <div className="absolute -left-[10000px]" aria-hidden="true">
          <label htmlFor="contact-website">Sitio web</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {enabled && siteKey && (
          <div className="mt-6">
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
            <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" data-action="contact" />
          </div>
        )}

        <button type="submit" disabled={!enabled || pending}
          className="mt-6 min-h-12 border border-[#ff2d00] bg-[#ff2d00] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:bg-transparent hover:text-[#ff2d00] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Enviar consulta"}
        </button>
        <p role="status" aria-live="polite" className="mt-4 font-mono text-[12px] leading-[1.8] text-white/75">
          {status || (enabled ? "También puedes escribirme directamente por correo." : "El enlace de correo directo está disponible a la izquierda.")}
        </p>
      </form>

      {successToast && typeof document !== "undefined" && createPortal(
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed left-4 right-4 top-[max(1rem,env(safe-area-inset-top))] z-[100000] sm:left-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:w-[min(25rem,calc(100vw-2rem))]"
        >
          <div className="pointer-events-auto flex items-start gap-3 border border-[#ff2d00]/60 bg-[#101310] p-4 text-[#f3efe8] shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
            <span aria-hidden="true" className="font-mono text-lg text-[#ff2d00]">✓</span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-semibold">Envío exitoso</p>
              <p className="mt-1 font-mono text-xs leading-relaxed text-white/70">
                Tu consulta fue aceptada. Gracias por escribirme.
              </p>
            </div>
            <button type="button" onClick={() => setSuccessToast(false)} aria-label="Cerrar notificación"
              className="shrink-0 px-2 text-white/60 hover:text-white">×</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
