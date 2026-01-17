"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { loginSchema, type LoginFormValues } from "../../utils/validation";
import TwoFactorVerificationForm from "./TwoFactorVerification";
import OptimizedImage from "../../components/ui/optimized-image";

// 2FA code validation schema
const twoFactorSchema = z.object({
  code: z
    .string()
    .min(6)
    .max(6, { message: "Verification code must be 6 digits" }),
});

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const twoFactorForm = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: Received non-JSON response");
      }

      const result = await response.json();

      if (!response.ok && !result.requiresTwoFactor) {
        throw new Error(result.error || "Failed to login");
      }

      // Check if 2FA is required
      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setUserEmail(data.email);
        toast.info("Please enter your verification code");
        setIsLoading(false);
        return;
      }

      // Show success message
      toast.success("Logged in successfully!");

      // Add a delay before redirecting to ensure cookie is set
      setTimeout(() => {
        // Force a hard navigation
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.message || "Login failed";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyTwoFactorCode(code: string): Promise<void> {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          code: code,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to verify code");
      }

      // Show success message
      toast.success("Logged in successfully!");

      // Add a delay before redirecting to ensure cookie is set
      setTimeout(() => {
        // Force a hard navigation
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.message || "Verification failed";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      throw error; // Re-throw to be caught by the TwoFactorVerificationForm
    } finally {
      setIsLoading(false);
    }
  }

  // Handle going back to login form from 2FA screen
  const handleCancelTwoFactor = () => {
    setRequiresTwoFactor(false);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex justify-center mb-6">
        <OptimizedImage
          src="/sendly-logo.png"
          alt="Sendly Logo"
          width={120}
          height={60}
          className="h-16 w-auto"
          priority
        />
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: "#3F4555" }}>
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500">
          Enter your credentials to access your account
        </p>
      </div>

      {errorMessage && !requiresTwoFactor && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          <p className="font-semibold">Error</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {!requiresTwoFactor ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      ) : (
        <TwoFactorVerificationForm
          email={userEmail}
          onVerify={verifyTwoFactorCode}
          onCancel={handleCancelTwoFactor}
          isLoading={isLoading}
        />
      )}

      <div className="text-center text-sm">
        <p>
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
