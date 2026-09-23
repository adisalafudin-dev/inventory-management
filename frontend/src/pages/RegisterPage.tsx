import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Box, Eye, EyeOff } from "lucide-react";
import { RegisterSchema } from "@/features/auth/schema";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";

const accountPoints = [
  "Data inventori Anda terpisah per akun — tidak tercampur dengan user lain.",
  "Satu akun mengelola kategori, lokasi, alat bahan, dan seluruh riwayat mutasi.",
  "Login kembali kapan saja, stok terakhir langsung tersedia.",
];

export default function RegisterPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  const { mutate: doRegister, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: RegisterSchema) => {
    doRegister(data);
  };

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      {/* Panel brand */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-secondary p-10 text-secondary-foreground lg:flex xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(to_bottom,transparent,transparent_35px,rgba(247,245,241,0.08)_35px,rgba(247,245,241,0.08)_36px)]"
        />
        <Link
          to={ROUTES.HOME}
          className="relative flex items-center gap-2.5"
          aria-label="Inventory Manager — beranda"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Box className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Inventory Manager
          </span>
        </Link>
        <div className="relative max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-secondary-foreground/60">
            Registrasi akun
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Catatan kerja dimulai dari satu akun.
          </h1>
          <p className="mt-4 text-sm leading-6 text-secondary-foreground/75">
            Daftar sekali, lalu langsung catat kategori, lokasi rak, dan barang
            pertama Anda.
          </p>
          <ul className="mt-8 space-y-4 border-t border-secondary-foreground/15 pt-8">
            {accountPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm leading-6 text-secondary-foreground/85"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative font-mono text-xs text-secondary-foreground/50">
          KATEGORI · LOKASI · ALAT BAHAN · MUTASI · TAG
        </p>
      </aside>

      {/* Form */}
      <section className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5"
            aria-label="Inventory Manager — beranda"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Box className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Inventory Manager
            </span>
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Masuk
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 md:px-8">
          <div className="w-full max-w-sm">
            <div className="border border-border bg-card shadow-xl shadow-black/5">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-xl font-semibold tracking-tight">
                  Buat akun baru
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Butuh kurang dari semenit untuk mulai mencatat inventori.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 p-6"
                noValidate
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="username"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="mis. budi_gudang"
                    autoComplete="username"
                    aria-invalid={!!errors.username}
                    {...registerField("username")}
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@perusahaan.id"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...registerField("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      className="pr-10"
                      {...registerField("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                      className="absolute right-0 top-0 flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" isDisabled={isPending}>
                  {isPending ? "Memproses..." : "Daftar & mulai mencatat"}
                  {!isPending && (
                    <ArrowRight className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </form>

              <div className="border-t border-border bg-muted px-6 py-4">
                <p className="text-center text-sm text-muted-foreground">
                  Sudah punya akun?{" "}
                  <Link
                    to={ROUTES.LOGIN}
                    className="font-semibold text-primary transition-colors hover:underline"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
