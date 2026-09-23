import { Box, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link
          to={ROUTES.DASHBOARD}
          className="flex items-center gap-2.5"
          aria-label="Inventory Manager — dashboard"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Box className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Inventory Manager
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground md:inline">
            {user?.username ?? "User"}
          </span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
