"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import ContactToast from "./ContactToast";
import {
  inquiryTypes,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact";

const emptyValues: ContactValues = {
  name: "",
  email: "",
  inquiry: "",
  message: "",
};
const inputClass =
  "mt-3 w-full min-w-0 rounded-none border border-white/25 bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-[#f3efe8] placeholder:text-white/35 focus-visible:border-[#ff2d00]";
const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-white/75";

export default function ContactForm() {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
  const enabled = Boolean(accessKey);
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const inFlight = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    },
    [],
  );
  const dismissToast = useCallback(() => {
    if (document.activeElement?.closest("[data-contact-toast]")) {
      formRef.current
        ?.querySelector<HTMLButtonElement>('button[type="submit"]')
        ?.focus({ preventScroll: true });
    }
    setToast(0);
  }, []);

  function change(key: keyof ContactValues, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setStatus("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessKey || inFlight.current) return;
    const form = event.currentTarget;
    const checked = validateContact(values);
    setErrors(checked);
    setStatus("");
    if (Object.keys(checked).length) {
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(checked)[0]}"]`)
        ?.focus();
      return;
    }
    const data = new FormData(form);
    if (data.get("botcheck")) {
      setStatus(
        "No pudimos validar la consulta. Utiliza el correo directo si el problema continúa.",
      );
      return;
    }
    data.set("access_key", accessKey);
    data.set("from_name", "Portfolio Isaías Frutos");
    data.set(
      "subject",
      `Consulta de portfolio: ${inquiryTypes.find((type) => type.value === values.inquiry)?.label}`,
    );
    inFlight.current = true;
    setPending(true);
    setToast(0);
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        signal: controller.signal,
      });
      if (controllerRef.current !== controller) return;
      if (response.status === 429) {
        setStatus(
          "Se alcanzó el límite de solicitudes. Espera unos minutos antes de intentar nuevamente.",
        );
        return;
      }
      const result: unknown = await response.json();
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("success" in result) ||
        result.success !== true
      ) {
        setStatus(
          "Web3Forms no confirmó el envío. Conservamos tus datos; intenta nuevamente o utiliza el correo directo.",
        );
        return;
      }
      setValues(emptyValues);
      form.reset();
      setErrors({});
      setStatus("Mensaje aceptado por Web3Forms. Gracias por contactarme.");
      setToast((previous) => previous + 1);
    } catch {
      if (controllerRef.current === controller)
        setStatus(
          "No pudimos confirmar el envío. Conservamos tus datos. Comprueba tu conexión y revisa antes de reintentar para evitar duplicados.",
        );
    } finally {
      window.clearTimeout(timeout);
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        inFlight.current = false;
        setPending(false);
      }
    }
  }

  return (
    <div>
      <noscript>
        <style>{"[data-contact-form] { display: none; }"}</style>
        <p className="font-mono text-sm leading-relaxed text-white/65">
          Para enviar el formulario necesitas JavaScript. También puedes
          contactar directamente por correo electrónico.
        </p>
      </noscript>

      <form
        data-contact-form
        ref={formRef}
        onSubmit={submit}
        noValidate
        aria-busy={pending}
        aria-labelledby="contact-form-heading"
        aria-describedby="contact-form-notice"
      >
        <h3
          id="contact-form-heading"
          className="text-2xl font-semibold tracking-[-0.03em]"
        >
          Cuéntame tu proyecto
        </h3>
        <p
          id="contact-form-notice"
          className="mt-3 font-mono text-[12px] leading-[1.8] text-white/65"
        >
          {enabled
            ? "Completa el formulario y envíame tu consulta. Tus datos se procesan mediante Web3Forms para responderte. Evita información confidencial."
            : "El envío por formulario está temporalmente desactivado. Puedes escribirme directamente al correo indicado."}
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
              disabled={pending}
              value={values.name}
              onChange={(event) => change("name", event.target.value)}
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            <p
              id="contact-name-error"
              className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]"
            >
              {errors.name}
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
              type="email"
              disabled={pending}
              value={values.email}
              onChange={(event) => change("email", event.target.value)}
              autoComplete="email"
              required
              maxLength={254}
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
            />
            <p
              id="contact-email-error"
              className="mt-2 font-mono text-xs leading-relaxed text-[#ff866e]"
            >
              {errors.email}
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
              disabled={pending}
              value={values.inquiry}
              onChange={(event) => change("inquiry", event.target.value)}
              required
              aria-invalid={!!errors.inquiry}
              aria-describedby={
                errors.inquiry ? "contact-inquiry-error" : undefined
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
              {errors.inquiry}
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
              rows={5}
              disabled={pending}
              value={values.message}
              onChange={(event) => change("message", event.target.value)}
              required
              minLength={20}
              maxLength={3000}
              aria-invalid={!!errors.message}
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
              {errors.message}
            </p>
          </div>
        </div>

        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <button
          type="submit"
          disabled={!enabled || pending}
          className="mt-6 min-h-12 border border-[#ff2d00] bg-[#ff2d00] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-black transition-colors hover:bg-transparent hover:text-[#ff2d00] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "ENVIANDO..." : "ENVIAR CONSULTA"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className="mt-4 font-mono text-[12px] leading-[1.8] text-white/75"
        >
          {status ||
            (enabled
              ? "También puedes escribirme directamente por correo."
              : "El enlace de correo directo está disponible a la izquierda.")}
        </p>
      </form>

      {toast > 0 && <ContactToast key={toast} onDismiss={dismissToast} />}
    </div>
  );
}
