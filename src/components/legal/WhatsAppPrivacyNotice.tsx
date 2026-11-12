import Link from "next/link";

export function WhatsAppPrivacyNotice({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-xs text-suma-navy/60"}>
      Al escribirnos por WhatsApp, tratamos tus datos según nuestro{" "}
      <Link href="/aviso-de-privacidad" className="underline decoration-suma-purple/50 underline-offset-2 hover:decoration-suma-purple">
        aviso de privacidad
      </Link>
      .
    </p>
  );
}
