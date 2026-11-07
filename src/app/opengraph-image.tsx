import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "72px 80px",
          background: "#1E2124",
          color: "#E9ECEA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#A7AFB6" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#F2994A" }} />
          {site.role} · {site.location}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 800, lineHeight: 0.9 }}>
          <span>ARSENE</span>
          <span style={{ color: "#F2994A", paddingLeft: 75 }}>KAREMA</span>
        </div>
        <div style={{ fontSize: 30, color: "#A7AFB6" }}>
          Building software people trust with their money, from interface to database.
        </div>
      </div>
    ),
    size,
  );
}
