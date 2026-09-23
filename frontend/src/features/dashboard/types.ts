export interface DashboardSummary {
  statistik: {
    totalJenisBarang: number;
    totalBarangRusak: number;
  };
  peringatan: {
    stokMenipis: RecentMutation[];
  };
  aktivitasTerbaru: RecentMutation[];
}

export interface RecentMutation {
  id: string;
  itemName: string;
  type: "MASUK" | "KELUAR";
  quantity: number;
  createdAt: string;
}
