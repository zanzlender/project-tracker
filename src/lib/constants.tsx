import {
  LayoutDashboard,
  SquareChartGantt,
  ClipboardCheck,
  Users,
} from "lucide-react";
import { type ReactNode } from "react";

export const DASHBOARD_SIDEBAR_LINKS = (
  projectId: string,
): { icon: ReactNode; displayName: string; url: string }[] => [
  {
    icon: <LayoutDashboard />,
    displayName: "Dashboard",
    url: `/dashboard`,
  },
  {
    icon: <SquareChartGantt />,
    displayName: "Overview",
    url: `/dashboard/${projectId}/overview`,
  },
  {
    icon: <ClipboardCheck />,
    displayName: "Tasks",
    url: `/dashboard/${projectId}/tasks`,
  },
  {
    icon: <Users />,
    displayName: "Members",
    url: `/dashboard/${projectId}/members`,
  },
];

export const NAVIGATION_ITEMS = [
  {
    displayName: "Dashboard",
    url: "/",
  },
];
