import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { authService, type RegisterPayload } from "../services/authService";
import { ROUTES } from "@/constants/routes";
import type { AxiosError } from "axios";

type ApiErrorResponse = {
  message?: string | { message?: string; error?: string };
};

export function useRegister() {
  const setAuth = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      toast.success("Registrasi berhasil");
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const responseMessage = error.response?.data?.message;
      const message =
        typeof responseMessage === "string"
          ? responseMessage
          : (responseMessage?.message ??
            responseMessage?.error ??
            "Terjadi Kesalahan");

      toast.error(message);
    },
  });
}
