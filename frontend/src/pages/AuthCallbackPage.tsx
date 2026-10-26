import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { authService } from "@/features/auth/services/authService";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const called = useRef(false);
  const code = params.get("code");

  useEffect(() => {
    if (!code || called.current) return;
    called.current = true;

    authService
      .googleExchange(code)
      .then(({ user, access_token }) => {
        login(user, access_token);
        navigate(ROUTES.DASHBOARD, { replace: true });
      })
      .catch(() => {
        toast.error("Login Google gagal. Silakan coba lagi.");
        navigate(ROUTES.LOGIN, { replace: true });
      });
  }, [code, login, navigate]);

  if (!code) return <Navigate to={ROUTES.LOGIN} replace />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">
        Menyelesaikan login Google...
      </p>
    </main>
  );
}
