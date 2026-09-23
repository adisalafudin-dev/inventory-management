// src/components/layout/SideBar.tsx
import { Box, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NAV_GROUPS } from "@/constants/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader className="border-b  border-sidebar-border p-3">
        <NavLink
          to="/dashboard"
          className={cn(
            "flex items-start   gap-3 rounded-md px-1 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          )}
          aria-label="Inventory Manager"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground md:size-8">
            <Box className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-semibold tracking-tight">
              Inventory Manager
            </span>
            <span className="block truncate text-xs text-sidebar-foreground/60">
              Ruang kerja inventori
            </span>
          </span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.title ?? "utama"} className="p-0 pb-4">
            {group.title && (
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-wide text-sidebar-foreground/55">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.path}>
                      <NavLink
                        to={item.path}
                        end
                        title={item.label}
                        className={({ isActive }) =>
                          cn(
                            "flex h-9 w-full items-center gap-3 rounded-md px-2 text-sm font-medium text-sidebar-foreground transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
                            isActive &&
                              "bg-sidebar-accent text-sidebar-accent-foreground",
                          )
                        }
                      >
                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </NavLink>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className="flex items-center gap-3 rounded-md px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            {(user?.username ?? "U").slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-medium">
              {user?.username ?? "Pengguna"}
            </span>
            <span className="block truncate text-xs text-sidebar-foreground/60">
              Akun aktif
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-sm font-medium text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          <span className="group-data-[collapsible=icon]:hidden">Keluar</span>
        </button>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
