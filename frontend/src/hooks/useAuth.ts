import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };
}
