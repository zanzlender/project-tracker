import { inferRouterOutputs } from "@trpc/server";
import {
  LayoutDashboard,
  SquareChartGantt,
  ClipboardCheck,
  SettingsIcon,
  Users,
} from "lucide-react";
import { type ReactNode } from "react";
import { AppRouter } from "~/server/api/root";
import dto from "~/server/db/dto";

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
  {
    icon: <SettingsIcon />,
    displayName: "Settings",
    url: `/dashboard/${projectId}/settings`,
  },
];

export const NAVIGATION_ITEMS = [
  {
    displayName: "Dashboard",
    url: "/",
  },
];

export type ReturnedTask = NonNullable<
  Awaited<ReturnType<typeof dto.GetProjectTasks>>
>["tasks"][number];

export type KanbanColumn = {
  id: string;
  title: string;
  tasks: ReturnedTask[];
};

export const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "1", title: "Backlog 🚦", tasks: [] },
  { id: "2", title: "In progress 🕴", tasks: [] },
  { id: "3", title: "Needs review ⛑", tasks: [] },
  { id: "4", title: "Completed ✅", tasks: [] },
];
