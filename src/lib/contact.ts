export const inquiryTypes = [
  { value: "web", label: "Desarrollo web" },
  { value: "ecommerce", label: "eCommerce" },
  { value: "integrations", label: "Integraciones y automatización" },
  { value: "collaboration", label: "Colaboración" },
] as const;

export type ContactValues = {
  name: string;
  email: string;
  inquiry: string;
  message: string;
};
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

// Client field validation. Web3Forms applies its own provider-side checks.
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < 2 || values.name.trim().length > 100)
    errors.name = "Escribe un nombre de entre 2 y 100 caracteres.";
  const email = values.email.trim();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Escribe un correo electrónico válido.";
  if (!inquiryTypes.some((type) => type.value === values.inquiry))
    errors.inquiry = "Selecciona un tipo de consulta.";
  if (values.message.trim().length < 20 || values.message.trim().length > 3000)
    errors.message = "Describe tu consulta en entre 20 y 3000 caracteres.";
  return errors;
}
