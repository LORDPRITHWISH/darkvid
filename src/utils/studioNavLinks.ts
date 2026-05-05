import {
  LayoutDashboard,
  Film,
  BarChart2,
  MessageSquare,
  Settings2,
  Subtitles,
  DollarSign,
  Music2,
  Settings,
} from "lucide-react";

export type StudioNavItem = {
  icon: React.ElementType;
  label: string;
  link: string; // relative to /studio/
};

export const studioNavLinks: StudioNavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard",    link: "" },
  { icon: Film,            label: "Content",      link: "content" },
  { icon: BarChart2,       label: "Analytics",    link: "analytics" },
  { icon: MessageSquare,   label: "Community",    link: "community" },
  { icon: Settings2,       label: "Customisation",link: "customisation" },
  { icon: Subtitles,       label: "Subtitles",    link: "subtitles" },
  { icon: DollarSign,      label: "Earn",         link: "earn" },
  { icon: Music2,          label: "Audio library",link: "audio-library" },
  { icon: Settings,        label: "Settings",     link: "settings" },
];
