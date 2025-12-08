"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2 } from "lucide-react";

interface TwoFactorVerificationFormProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function TwoFactorVerificationForm({
  email,
  onVerify,
  onCancel,
  isLoading,
}: TwoFactorVerificationFormProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setError(null);

    try {
      await onVerify(verificationCode);
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold">Palette Mail Verification</h1>
        <p className="text-sm text-gray-500">
          Enter the verification code from your authenticator app
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <Input
            id="verification-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={verificationCode}
            onChange={handleChange}
            placeholder="123456"
            autoComplete="one-time-code"
            disabled={isLoading}
            autoFocus
            className="font-mono text-center text-lg tracking-widest"
          />
          <div className="text-xs text-gray-500">
            Enter the 6-digit code from your authenticator app
          </div>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="sm:flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="sm:flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
