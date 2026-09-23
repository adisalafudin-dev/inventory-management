import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Box, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginSchema } from "@/features/auth/schema";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";

const loginPoints = [
  "Stok terakhir langsung tersedia begitu Anda masuk — tanpa harus mengecek ulang dari awal.",
  "Semua riwayat mutasi masuk dan keluar tersimpan, bisa ditelusuri kapan saja.",
  "Data Anda terpisah per akun — tidak akan tercampur dengan user lain.",
];

export default function LoginPage() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const { mutate: doLogin, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginSchema) => {
    doLogin(data);
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
            Masuk ke akun
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Kembali ke meja kerja Anda.
          </h1>
          <p className="mt-4 text-sm leading-6 text-secondary-foreground/75">
            Masuk untuk melanjutkan pencatatan stok, menelusuri mutasi, dan
            memastikan barang di rak sesuai catatan.
          </p>
          <ul className="mt-8 space-y-4 border-t border-secondary-foreground/15 pt-8">
            {loginPoints.map((point) => (
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
            to={ROUTES.REGISTER}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Daftar
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 md:px-8">
          <div className="w-full max-w-sm">
            <div className="border border-border bg-card shadow-xl shadow-black/5">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-xl font-semibold tracking-tight">
                  Masuk ke akun Anda
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lanjutkan mengelola inventori dari terakhir kali Anda
                  tinggalkan.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 p-6"
                noValidate
              >
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
                      placeholder="Masukkan password Anda"
                      autoComplete="current-password"
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
                  {isPending ? "Memproses..." : "Masuk"}
                  {!isPending && (
                    <ArrowRight className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </form>

              <div className="border-t border-border bg-muted px-6 py-4">
                <p className="text-center text-sm text-muted-foreground">
                  Belum punya akun?{" "}
                  <Link
                    to={ROUTES.REGISTER}
                    className="font-semibold text-primary transition-colors hover:underline"
                  >
                    Daftar di sini
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
