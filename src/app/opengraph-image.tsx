import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.serviceDescriptor}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen OG con wordmark tipográfico provisional (no es el logotipo oficial). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFF4E6",
          color: "#0B1240",
          padding: 72,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 9999, background: "#FF5A00" }} />
        <div style={{ position: "absolute", right: 220, top: 260, width: 220, height: 220, borderRadius: 9999, background: "#FF2ED1", opacity: 0.85 }} />
        <div style={{ position: "absolute", right: 40, bottom: -90, width: 300, height: 300, borderRadius: 9999, background: "#3B0CA8" }} />
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>SUMA STUDIO</div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>Más tiempo para crear bienestar.</div>
          <div style={{ marginTop: 28, fontSize: 30 }}>{site.serviceDescriptor}</div>
          <div style={{ marginTop: 12, fontSize: 24, opacity: 0.7 }}>{site.location.label}</div>
        </div>
      </div>
    ),
    size,
  );
}
