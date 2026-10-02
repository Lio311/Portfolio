import { ImageResponse } from "next/og";

export const alt = "Lior Zafrir, AI Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chips = ["Autonomous bots", "LLM agents", "3D web", "Full-stack SaaS", "Biomedical DSP"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 80% 20%, #312e81 0%, #09090b 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#a5b4fc", marginBottom: 16 }}>liorzafrir.vercel.app</div>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: -3,
            backgroundImage: "linear-gradient(135deg, #818cf8, #c084fc, #f472b6)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Lior Zafrir
        </div>
        <div style={{ display: "flex", fontSize: 40, color: "#e4e4e7", marginTop: 8 }}>AI Engineer · Full-Stack Developer</div>
        <div style={{ display: "flex", gap: 14, marginTop: 48, flexWrap: "wrap" }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                fontSize: 24,
                padding: "10px 22px",
                borderRadius: 999,
                border: "1px solid rgba(129,140,248,0.5)",
                background: "rgba(99,102,241,0.12)",
                color: "#c7d2fe",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
