import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string | null };
  children: ReactNode;
  prefetch?: boolean | null;
};

/** Sustituto de next/link para pruebas de componentes: un <a> simple sin router. */
export default function LinkMock({ href, children, prefetch, ...rest }: Props) {
  void prefetch;
  const url = typeof href === "string" ? href : (href.pathname ?? "");
  return (
    <a
      href={url}
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
