"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ContactToast.module.css";

export default function ContactToast({ onDismiss }: { onDismiss: () => void }) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setClosing(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onDismiss, 200);
    return () => window.clearTimeout(timer);
  }, [closing, onDismiss]);

  return createPortal(
    <div
      data-contact-toast
      role="status"
      aria-live="polite"
      className={`${styles.toast} ${closing ? styles.closing : ""}`}
    >
      <div className="pointer-events-auto flex items-start gap-3 border border-[#ff2d00]/60 bg-[#090a09] p-4 text-[#f3efe8] shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
        <span aria-hidden="true" className="font-mono text-lg text-[#ff2d00]">
          ✓
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-semibold">Envío exitoso</p>
          <p className="mt-1 font-mono text-xs leading-relaxed text-white/70">
            Tu mensaje fue enviado correctamente. Gracias por contactarme.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setClosing(true)}
          aria-label="Cerrar notificación"
          className="shrink-0 px-2 text-white/60 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>,
    document.body,
  );
}
