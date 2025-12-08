"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";

export default function EmailTester() {
  // State for test email input
  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEnv, setIsCheckingEnv] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === "development";

  // Hide the component and save state to localStorage
  const handleHide = () => {
    setIsVisible(false);
    localStorage.setItem("emailTesterHidden", "true");
  };

  // Function to check environment variables
  const handleCheckEnv = async () => {
    try {
      setIsCheckingEnv(true);
      setError(null);
      setEnvInfo(null);

      const response = await fetch("/api/debug/env");

      if (!response.ok) {
        throw new Error(
          `Failed to check environment: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      setEnvInfo(data);

      if (!data.isSmtpConfigured) {
        setError(
          "SMTP is not fully configured. Please check your environment variables.",
        );
      }
    } catch (error: any) {
      setError(`Error checking environment: ${error.message}`);
      toast.error(error.message);
    } finally {
      setIsCheckingEnv(false);
    }
  };

  // Function to send test email
  const handleTestEmail = async () => {
    try {
      // Validate email format
      if (!testEmail || !testEmail.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }

      setIsLoading(true);
      setError(null);
      setResult(null);

      // Check environment first
      await handleCheckEnv();

      // Send test email
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send test email");
      }

      setResult(`Test email sent successfully to ${testEmail}`);
      toast.success("Test email sent successfully!");
    } catch (error: any) {
      setError(`Error sending test email: ${error.message}`);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize visibility from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("emailTesterHidden");
    if (savedState === "true") {
      setIsVisible(false);
    }
  }, []);

  // If we're in production, return null immediately
  if (!isDevelopment) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Email Configuration Tester</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Dev Only
          </span>
          <button
            onClick={handleHide}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            title="Hide email tester"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          <p className="font-medium">Success:</p>
          <p>{result}</p>
        </div>
      )}

      {envInfo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md">
          <p className="font-medium mb-2">Environment Info:</p>
          <div className="text-sm font-mono bg-white p-2 rounded border border-blue-100 overflow-x-auto">
            <p>SMTP Configuration:</p>
            <ul className="list-disc list-inside ml-2">
              {Object.entries(envInfo.smtpConfig).map(
                ([key, value]: [string, any]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ),
              )}
            </ul>
            <p className="mt-2">App Configuration:</p>
            <ul className="list-disc list-inside ml-2">
              {Object.entries(envInfo.appConfig).map(
                ([key, value]: [string, any]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <div>
          <label
            htmlFor="testEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Test Email Address
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              id="testEmail"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm flex-1 focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button
              onClick={handleTestEmail}
              disabled={isLoading || !testEmail}
              className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Test Email"}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            This will send a test email to verify your SMTP configuration.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCheckEnv}
            disabled={isCheckingEnv}
            className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingEnv ? "Checking..." : "Check Environment"}
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Make sure you have set up the following in your .env file:</p>
        <ul className="list-disc list-inside ml-2 mt-1">
          <li>SMTP_HOST</li>
          <li>SMTP_PORT</li>
          <li>SMTP_USER</li>
          <li>SMTP_PASSWORD</li>
        </ul>
      </div>
    </div>
  );
}
