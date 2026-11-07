import { Ico } from "./Ico";
// Maps icon names stored in the CMS (admin dropdowns) to Google Material Symbols.
const MAP: Record<string, string> = {
  palette: "palette", code: "code", "shopping-bag": "shopping_bag", sparkles: "bolt", compass: "explore",
  "mouse-pointer-click": "ads_click", layers: "layers", cpu: "memory", "message-square": "forum", handshake: "handshake",
  lightbulb: "lightbulb", award: "workspace_premium", "shield-check": "verified_user", rocket: "rocket_launch", users: "groups", "trending-up": "trending_up",
};
export function Icon({ name, className = "h-6 w-6" }: { name?: string | null; className?: string }) {
  return <Ico name={(name && MAP[name]) || "star"} className={className} />;
}
