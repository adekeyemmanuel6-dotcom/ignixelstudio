import { Palette, Code, ShoppingBag, Sparkles, Compass, MousePointerClick, Layers, Cpu, MessageSquare, Handshake, Lightbulb, Award, ShieldCheck, Rocket, Users, TrendingUp, Star, type LucideIcon } from "lucide-react";
const map: Record<string, LucideIcon> = {
  palette: Palette, code: Code, "shopping-bag": ShoppingBag, sparkles: Sparkles, compass: Compass, "mouse-pointer-click": MousePointerClick,
  layers: Layers, cpu: Cpu, "message-square": MessageSquare, handshake: Handshake, lightbulb: Lightbulb, award: Award, "shield-check": ShieldCheck,
  rocket: Rocket, users: Users, "trending-up": TrendingUp,
};
export function Icon({ name, className = "h-6 w-6" }: { name?: string | null; className?: string }) {
  const C = (name && map[name]) || Star;
  return <C className={className} aria-hidden />;
}
