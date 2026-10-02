import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1117" }}>
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <rect x="12.5" y="6.5" width="7" height="5" rx="1.2" fill="#4fe3c1" />
          <path d="M16 11.5V14" stroke="#4fe3c1" strokeWidth="1.5" />
          <rect x="6.5" y="14" width="8.5" height="5" rx="1.2" stroke="#e6edf3" strokeWidth="1.5" />
          <rect x="17" y="14" width="8.5" height="5" rx="1.2" stroke="#e6edf3" strokeWidth="1.5" />
          <rect x="6.5" y="21.5" width="19" height="4.5" rx="1.2" fill="#e6edf3" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
