"use client";

import dynamic from "next/dynamic";

/** La demo vive solo en el navegador (estado local y sessionStorage), sin render de servidor. */
const StudioOs = dynamic(() => import("./StudioOs"), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" aria-label="Cargando el configurador" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="h-[34rem] animate-pulse rounded-[1.5rem] border border-[#E8E2DA] bg-white" />
      <div className="hidden h-72 animate-pulse rounded-2xl border border-[#E8E2DA] bg-white lg:block" />
    </div>
  ),
});

export function StudioOsLoader() {
  return <StudioOs />;
}
