import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Bot, House, Video, Wrench } from "lucide-react";

const tabs = [
  { label: "Home", icon: House, path: "/" },
  { label: "Buddy", icon: Bot, path: "/buddy" },
  { label: "Tools", icon: Wrench, path: "/tools" },
  { label: "Videos", icon: Video, path: "/videos" },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav
      data-ocid="bottom_tab_bar"
      className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-[#0A1628] border-t border-sky-900/40 flex items-stretch"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map(({ label, icon: Icon, path }) => {
        const isActive =
          path === "/" ? currentPath === "/" : currentPath.startsWith(path);
        return (
          <button
            key={path}
            data-ocid={`nav.${label.toLowerCase()}.link`}
            type="button"
            onClick={() => navigate({ to: path })}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 ${
              isActive ? "text-sky-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-transform duration-150 ${
                isActive ? "scale-110" : ""
              }`}
            />
            <span
              className={`text-[10px] font-medium leading-none ${
                isActive ? "text-sky-400" : "text-slate-500"
              }`}
            >
              {label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-sky-400 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
