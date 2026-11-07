import { ImageResponse } from "next/og";

export const alt = "Ignixel Studio: web design, development and AI integration agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social-sharing image for every page that does not set its own (generated, no external assets).
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#000 0%,#07080c 55%,#010BCC 160%)", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="84" height="84" viewBox="0 0 1668 1668"><rect width="1668" height="1668" rx="97" fill="#010BCC" /><g fill="#fff"><rect x="484" y="463" width="173" height="173" /><rect x="1014" y="463" width="173" height="173" /><rect x="657" y="636" width="357" height="357" /><rect x="480" y="996" width="173" height="173" /><rect x="1014" y="993" width="173" height="173" /></g><g fill="#010BCC"><polygon points="827,723 827,775 760,816 827,855 827,907 712,836 712,795" /><polygon points="850,723 850,775 917,816 850,855 850,907 965,836 965,795" /></g></svg>
          <div style={{ fontSize: 44, fontWeight: 700, display: "flex" }}>Ignixel<span style={{ color: "#8b8bff", marginLeft: 12 }}>Studio</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2, maxWidth: 980, display: "flex" }}>Web design, development &amp; AI integration</div>
          <div style={{ fontSize: 32, color: "#b9bccf", display: "flex" }}>Websites and digital products built to generate real results.</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#6fdc5a" }}>ignixels.com</div>
      </div>
    ),
    size,
  );
}
