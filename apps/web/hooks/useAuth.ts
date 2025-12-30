"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  setTokens,
  clearTokens,
  getAccessToken,
  type User,
  type LoginDto,
  type RegisterDto,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          return null;
        }

        const response = await authApi.getMe();
        return response.data;
      } catch (error) {
        clearTokens();
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      queryClient.setQueryData(["auth", "me"], user);
      toast.success(`Welcome back, ${user.firstName}!`);
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      queryClient.setQueryData(["auth", "me"], user);
      toast.success(`Welcome to UniStudy, ${user.firstName}! 🎉`);
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearTokens();
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: () => {
      clearTokens();
      queryClient.setQueryData(["auth", "me"], null);
      router.push("/login");
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
