import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "After Framework";

const rows: { labels: string[]; accent?: boolean }[] = [
  { labels: ["lib/features/"], accent: true },
  { labels: ["after_ecosystem", "after_ai"] },
  { labels: ["after_consumer", "after_enterprise"] },
  { labels: ["after_core", "after_design_system"] },
  { labels: ["after_firebase"] },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0d1117",
          backgroundImage:
            "linear-gradient(rgba(138,149,168,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(138,149,168,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "#e6edf3",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 520 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
              <rect x="1" y="1" width="30" height="30" rx="7" stroke="#8a95a8" strokeOpacity="0.5" strokeWidth="1.2" />
              <rect x="12.5" y="6.5" width="7" height="5" rx="1.2" fill="#4fe3c1" />
              <rect x="6.5" y="14" width="8.5" height="5" rx="1.2" stroke="#e6edf3" strokeWidth="1.5" />
              <rect x="17" y="14" width="8.5" height="5" rx="1.2" stroke="#e6edf3" strokeWidth="1.5" />
              <rect x="6.5" y="21.5" width="19" height="4.5" rx="1.2" fill="#e6edf3" />
            </svg>
            <div style={{ fontSize: 30, fontWeight: 600 }}>After Framework</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 22, color: "#4fe3c1", fontFamily: "ui-monospace, monospace" }}>supercore</div>
            <div style={{ fontSize: 22, color: "#9aa6b8" }}>afterframework.com</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, flex: 1 }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              {row.labels.map((label) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 64,
                    borderRadius: 10,
                    border: row.accent ? "2px solid #4fe3c1" : "1.5px solid #2c3544",
                    background: row.accent ? "rgba(79,227,193,0.12)" : "#141a23",
                    fontSize: 22,
                    fontFamily: "ui-monospace, monospace",
                    color: row.accent ? "#4fe3c1" : "#c9d3df",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
