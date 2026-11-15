import { NextResponse } from "next/server";
import { inquiryTypes, validateContact, type ContactValues } from "@/lib/contact";

export const runtime = "nodejs";

const recipient = "isaiahweb333@gmail.com";
const maxBodyBytes = 12_000;

function respond(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function allowedOrigins(): Set<string> {
  const origins = new Set([
    "https://isaiasfrutos.dev",
    "https://www.isaiasfrutos.dev",
  ]);
  for (const variable of ["VERCEL_URL", "VERCEL_BRANCH_URL"]) {
    const host = process.env[variable];
    if (host) origins.add(`https://${host}`);
  }
  for (const value of (process.env.CONTACT_ALLOWED_ORIGINS ?? "").split(",")) {
    const origin = value.trim();
    if (origin) origins.add(origin);
  }
  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }
  return origins;
}

type ContactPayload = ContactValues & {
  website?: unknown;
  turnstileToken?: unknown;
};

export async function POST(request: Request) {
  // Fail closed until mail, domain and bot protection are configured.
  if (
    process.env.CONTACT_ENABLED !== "true" ||
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_FROM_EMAIL ||
    !process.env.TURNSTILE_SECRET_KEY
  ) {
    return respond({ success: false, message: "El formulario no está disponible temporalmente. Utiliza el correo directo." }, 503);
  }

  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins().has(origin)) {
    return respond({ success: false, message: "Origen no permitido." }, 403);
  }
  if (!(request.headers.get("content-type") ?? "").startsWith("application/json")) {
    return respond({ success: false, message: "Formato de envío no válido." }, 415);
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > maxBodyBytes) {
    return respond({ success: false, message: "La consulta es demasiado larga." }, 413);
  }

  let payload: ContactPayload;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > maxBodyBytes) {
      return respond({ success: false, message: "La consulta es demasiado larga." }, 413);
    }
    payload = JSON.parse(raw) as ContactPayload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Invalid JSON payload");
  } catch {
    return respond({ success: false, message: "No se pudo leer la consulta." }, 400);
  }

  // Honeypot: do not deliver submissions that fill the hidden field.
  if (typeof payload.website !== "string" || payload.website.length > 0) {
    return respond({ success: false, message: "La consulta no pudo verificarse." }, 400);
  }

  const keys = ["name", "email", "inquiry", "message"] as const;
  if (keys.some((key) => typeof payload[key] !== "string")) {
    return respond({ success: false, message: "Revisa los campos de la consulta." }, 400);
  }
  const values: ContactValues = {
    name: payload.name,
    email: payload.email,
    inquiry: payload.inquiry,
    message: payload.message,
  };
  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return respond({ success: false, message: "Revisa los campos indicados.", errors }, 422);
  }

  if (typeof payload.turnstileToken !== "string" || payload.turnstileToken.length < 1 || payload.turnstileToken.length > 2048) {
    return respond({ success: false, message: "Completa la verificación antispam." }, 400);
  }

  try {
    const verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: payload.turnstileToken,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!verificationResponse.ok) throw new Error("Turnstile unavailable");
    const result = (await verificationResponse.json()) as { success?: boolean; action?: string; hostname?: string };
    if (!result.success || result.action !== "contact" || result.hostname !== new URL(origin).hostname) {
      return respond({ success: false, message: "No se pudo verificar la consulta. Inténtalo de nuevo." }, 400);
    }
  } catch {
    return respond({ success: false, message: "No se pudo completar la verificación. Inténtalo más tarde." }, 502);
  }

  const type = inquiryTypes.find((item) => item.value === values.inquiry);
  const cleanName = values.name.trim().replace(/[\r\n]/g, " ");
  const subject = `Nueva consulta del portfolio — ${type?.label ?? "Contacto"}`;
  const text = [
    "Nueva consulta desde isaiasfrutos.dev",
    "",
    `Nombre: ${cleanName}`,
    `Correo: ${values.email.trim()}`,
    `Tipo: ${type?.label ?? values.inquiry}`,
    "",
    "Mensaje:",
    values.message.trim(),
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [recipient],
        reply_to: values.email.trim(),
        subject,
        text,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      // Never expose provider errors, addresses or credentials to visitors.
      return respond({ success: false, message: "No pudimos enviar tu consulta. Intenta de nuevo o escríbenos por correo." }, 502);
    }
    const data = (await response.json()) as { id?: string };
    if (!data.id) throw new Error("Provider did not confirm acceptance");
    return respond({ success: true, message: "Envío exitoso. Tu consulta fue aceptada para entrega." }, 200);
  } catch {
    return respond({ success: false, message: "No pudimos confirmar el envío. Revisa tu correo antes de intentar de nuevo o contáctanos directamente." }, 502);
  }
}
