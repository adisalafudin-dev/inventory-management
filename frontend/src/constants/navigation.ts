import {
  LayoutDashboard,
  Boxes,
  MapPin,
  Wrench,
  ArrowLeftRight,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title?: string; // opsional, buat grouping section
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    ],
  },
  {
    title: "Manajemen Data",
    items: [
      { label: "Kategori", path: ROUTES.CATEGORIES, icon: Boxes },
      { label: "Lokasi Penyimpanan", path: ROUTES.LOCATIONS, icon: MapPin },
      { label: "Alat & Bahan", path: ROUTES.ITEMS, icon: Wrench },
      { label: "Tag", path: ROUTES.TAGS, icon: Tag },
    ],
  },
  {
    title: "Aktivitas",
    items: [
      { label: "Mutasi Stok", path: ROUTES.MUTATIONS, icon: ArrowLeftRight },
    ],
  },
];
