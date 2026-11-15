"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  inquiryTypes,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact";

type FormState = { errors: ContactErrors; reviewed: boolean; revision: number };
const initialState: FormState = { errors: {}, reviewed: false, revision: 0 };

async function reviewDemo(
  previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const values: ContactValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    inquiry: String(formData.get("inquiry") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const errors = validateContact(values);
  // A review is deliberately not a delivery confirmation. No fetch or storage.
  return {
    errors,
    reviewed: Object.keys(errors).length === 0,
    revision: previous.revision + 1,
  };
}

const inputClass =
  "mt-3 w-full min-w-0 rounded-none border border-white/25 bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-[#f3efe8] placeholder:text-white/35 focus-visible:border-[#ff2d00]";
const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-white/75";

export default function ContactForm() {
  const [state, action, pending] = useActionState(reviewDemo, initialState);
  const [values, setValues] = useState<ContactValues>({
    name: "",
    email: "",
    inquiry: "",
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!state.revision) return;
    const invalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    if (invalid) invalid.focus();
    else statusRef.current?.focus({ preventScroll: true });
  }, [state]);

  return (
    <div>
      <noscript>
        <style>{"[data-contact-demo] { display: none; }"}</style>
        <p className="font-mono text-sm leading-relaxed text-white/65">
          La demostración requiere JavaScript. Puedes contactar por correo con
          el enlace de esta sección.
        </p>
      </noscript>
      <form
        ref={formRef}
        action={action}
        noValidate
        data-contact-demo
        aria-labelledby="contact-form-heading"
        aria-describedby="contact-demo-notice"
      >
        <h3
          id="contact-form-heading"
          className="text-2xl font-semibold tracking-[-0.03em]"
        >
          Cuéntame tu proyecto
        </h3>
        <p
          id="contact-demo-notice"
          className="mt-3 font-mono text-[12px] leading-[1.8] text-[#ff2d00]"
        >
          Demostración · envío desactivado. Puedes revisar los campos; los datos
          no se envían fuera de esta página.
        </p>
        <div className="mt-8 grid min-w-0 gap-6 sm:grid-cols-2">
          <div className="min-w-0">
            <label className={labelClass} htmlFor="contact-name">
              Nombre <span aria-hidden="true">*</span>
            </label>
            <input
              className={inputClass}
              id="contact-name"
              name="name"
              value={values.name}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              aria-invalid={!!state.errors.name}
              aria-describedby={
                state.errors.name ? "contact-name-error" : undefined
              }
            />
            <p
              id="contact-name-error"
              className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]"
            >
              {state.errors.name}
            </p>
          </div>
          <div className="min-w-0">
            <label className={labelClass} htmlFor="contact-email">
              Correo electrónico <span aria-hidden="true">*</span>
            </label>
            <input
              className={inputClass}
              id="contact-email"
              name="email"
              value={values.email}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  email: event.target.value,
                }))
              }
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              aria-invalid={!!state.errors.email}
              aria-describedby={
                state.errors.email ? "contact-email-error" : undefined
              }
            />
            <p
              id="contact-email-error"
              className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]"
            >
              {state.errors.email}
            </p>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label className={labelClass} htmlFor="contact-inquiry">
              Tipo de consulta <span aria-hidden="true">*</span>
            </label>
            <select
              className={inputClass}
              id="contact-inquiry"
              name="inquiry"
              value={values.inquiry}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  inquiry: event.target.value,
                }))
              }
              required
              aria-invalid={!!state.errors.inquiry}
              aria-describedby={
                state.errors.inquiry ? "contact-inquiry-error" : undefined
              }
            >
              <option className="bg-[#090a09]" value="">
                Selecciona una opción
              </option>
              {inquiryTypes.map((type) => (
                <option
                  className="bg-[#090a09]"
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>
            <p
              id="contact-inquiry-error"
              className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]"
            >
              {state.errors.inquiry}
            </p>
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label className={labelClass} htmlFor="contact-message">
              Mensaje <span aria-hidden="true">*</span>
            </label>
            <textarea
              className={inputClass}
              id="contact-message"
              name="message"
              value={values.message}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  message: event.target.value,
                }))
              }
              rows={5}
              required
              minLength={20}
              maxLength={3000}
              aria-invalid={!!state.errors.message}
              aria-describedby="contact-message-hint contact-message-error"
            />
            <p
              id="contact-message-hint"
              className="mt-2 font-mono text-xs leading-relaxed text-white/50"
            >
              Todos los campos son obligatorios. Mensaje: 20–3000 caracteres.
              Evita incluir información confidencial.
            </p>
            <p
              id="contact-message-error"
              className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]"
            >
              {state.errors.message}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-6 min-h-12 border border-[#ff2d00] bg-[#ff2d00] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:bg-transparent hover:text-[#ff2d00] disabled:opacity-60"
        >
          {pending ? "Validando…" : "Revisar consulta"}
        </button>
        <p
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="mt-4 font-mono text-[12px] leading-[1.8] text-white/75"
        >
          {state.reviewed
            ? "Datos revisados. Esta demostración no envía mensajes. Para continuar, utiliza el enlace de correo."
            : state.revision
              ? "Revisa los campos indicados. No se ha enviado ningún mensaje."
              : "Para enviar una consulta real, escríbeme por correo."}
        </p>
      </form>
    </div>
  );
}
