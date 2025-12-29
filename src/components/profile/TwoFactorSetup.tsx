"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Shield, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "../ui/use-toast";
import Image from "next/image";

interface TwoFactorSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({
  onComplete,
  onCancel,
}: TwoFactorSetupProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"initial" | "verifying">("initial");

  // Function to start the 2FA setup process - gets QR code
  const startSetup = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/user/setup-2fa", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to start 2FA setup");
      }

      const data = await response.json();

      // Set the QR code and secret key
      setQrCode(data.qrCode);
      setSecretKey(data.secret);
      setStep("verifying");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error setting up 2FA",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify the code entered by the user
  const verifyCode = async () => {
    if (!confirmationCode || confirmationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/user/confirm-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: confirmationCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid verification code");
      }

      toast({
        title: "Success",
        description: "Palette Mail Authentication enabled successfully",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to copy secret key to clipboard
  const copyToClipboard = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Secret key copied to clipboard",
      });

      // Reset copied status after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Set Up Palette Mail Authentication
        </CardTitle>
        <CardDescription>
          Protect your account with an additional layer of security
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "initial" ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              <p className="mb-2">
                Palette Mail Authentication adds an extra layer of security to
                your account by requiring a verification code from your
                authenticator app.
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Click the button below to start setup</li>
                <li>Scan the QR code with your authenticator app</li>
                <li>Enter the verification code to confirm setup</li>
              </ol>
            </div>

            <Button
              onClick={startSetup}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Begin Setup"
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Step 1: Scan QR Code</h3>
                <p className="text-xs text-gray-500">
                  Scan this QR code with your authenticator app (like Google
                  Authenticator, Authy, or Microsoft Authenticator)
                </p>

                {qrCode && (
                  <div className="flex justify-center p-4 bg-gray-50 rounded-md">
                    <Image
                      src={qrCode}
                      alt="QR Code for 2FA"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  Step 2: Or Enter Code Manually
                </h3>
                <p className="text-xs text-gray-500">
                  If you can't scan the QR code, you can manually enter this
                  secret key into your app
                </p>

                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 text-xs bg-gray-50 rounded border font-mono">
                    {secretKey}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Step 3: Verify Setup</h3>
                <p className="text-xs text-gray-500">
                  Enter the 6-digit code from your authenticator app to verify
                  the setup
                </p>

                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={confirmationCode}
                      onChange={(e) => {
                        // Only allow numbers and limit to 6 digits
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        if (value.length <= 6) {
                          setConfirmationCode(value);
                        }
                      }}
                      placeholder="123456"
                      autoComplete="one-time-code"
                      disabled={isLoading}
                      className="font-mono text-center text-lg tracking-widest"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="sm:flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={verifyCode}
                  disabled={isLoading || confirmationCode.length !== 6}
                  className="sm:flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Enable"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
