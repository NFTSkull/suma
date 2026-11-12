"use client";

import dynamic from "next/dynamic";

/** La demo vive solo en el navegador (estado local y sessionStorage), sin render de servidor. */
const StudioOs = dynamic(() => import("./StudioOs"), {
  ssr: false,
  loading: () => <div aria-busy="true" aria-label="Cargando SUMA Studio OS" className="fixed inset-0 z-[79]" />,
});

export function StudioOsLoader() {
  return <StudioOs />;
}
