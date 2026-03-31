import { useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, Bot, House, Video, Wrench } from "lucide-react";

const tabs = [
  { label: "Home", icon: House, path: "/" },
  { label: "Buddy", icon: Bot, path: "/buddy" },
  { label: "Tools", icon: Wrench, path: "/tools" },
  { label: "Videos", icon: Video, path: "/videos" },
  { label: "Resources", icon: BookOpen, path: "/resources" },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav
      data-ocid="bottom_tab_bar"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#0A1628] border-t border-sky-900/30"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map(({ label, icon: Icon, path }) => {
        const isActive =
          path === "/" ? currentPath === "/" : currentPath.startsWith(path);
        return (
          <button
            key={path}
            type="button"
            data-ocid={`nav.${label.toLowerCase()}.link`}
            onClick={() => navigate({ to: path })}
            className="flex flex-col items-center gap-0.5 py-2 px-2 min-w-0 flex-1 transition-colors"
            style={{ color: isActive ? "#38BDF8" : "#475569" }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold leading-none truncate">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
