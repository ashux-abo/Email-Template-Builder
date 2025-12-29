"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import {
  Computer,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Shield,
  Loader2,
  X,
  AlertTriangle,
  Laptop,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useToast } from "../ui/use-toast";
import { format, formatDistanceToNow } from "date-fns";

interface DeviceInfo {
  browser: string;
  os: string;
  ip: string;
  deviceType: string;
}

interface Session {
  _id: string;
  deviceInfo: DeviceInfo;
  lastActive: string;
  createdAt: string;
  isCurrent: boolean;
}

export default function ActiveSessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch active sessions
  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/user/sessions");

      if (!response.ok) {
        throw new Error("Failed to fetch active sessions");
      }

      const data = await response.json();

      if (data.success) {
        setSessions(data.sessions);
      } else {
        throw new Error(data.message || "Failed to fetch active sessions");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
      toast({
        title: "Error",
        description: error.message || "Failed to fetch active sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle revoking a specific session
  const handleRevokeSession = async (sessionId: string) => {
    try {
      setIsRevoking(true);

      const response = await fetch("/api/user/sessions/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to revoke session");
      }

      // Refresh sessions list
      await fetchSessions();

      toast({
        title: "Success",
        description: "Session revoked successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke session",
        variant: "destructive",
      });
    } finally {
      setIsRevoking(false);
      setShowConfirmDialog(false);
    }
  };

  // Handle revoking all other sessions
  const handleRevokeAllSessions = async () => {
    try {
      setIsRevoking(true);

      const response = await fetch("/api/user/sessions/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          revokeAll: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to revoke sessions");
      }

      // Refresh sessions list
      await fetchSessions();

      toast({
        title: "Success",
        description: "All other sessions revoked successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke sessions",
        variant: "destructive",
      });
    } finally {
      setIsRevoking(false);
      setShowLogoutAllDialog(false);
    }
  };

  // Format device info
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-5 w-5 text-gray-500" />;
      case "tablet":
        return <Tablet className="h-5 w-5 text-gray-500" />;
      case "desktop":
        return <Computer className="h-5 w-5 text-gray-500" />;
      case "laptop":
        return <Laptop className="h-5 w-5 text-gray-500" />;
      default:
        return <Globe className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Unknown date";
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  // Mask IP address for privacy
  const maskIpAddress = (ip: string) => {
    if (!ip || ip === "Unknown") return "Unknown";

    // Handle IPv6 localhost
    if (ip === "::1") return "localhost";

    // Handle IPv4 addresses
    if (ip.includes(".")) {
      const parts = ip.split(".");
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.*.*`;
      }
    }

    // Handle IPv6 addresses
    if (ip.includes(":")) {
      // Show only the first two segments of IPv6
      const parts = ip.split(":");
      return `${parts[0]}:${parts[1]}:****`;
    }

    // If format is unexpected, return as is
    return ip;
  };

  const handleLogout = (session: Session) => {
    if (session.isCurrent) {
      // Handle current session logout (should redirect to login)
      console.log("Logging out current session");
    } else {
      setSelectedSession(session);
      setShowConfirmDialog(true);
    }
  };

  const confirmSessionLogout = () => {
    if (selectedSession) {
      handleRevokeSession(selectedSession._id);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            View and manage your active login sessions across devices
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-4 text-center bg-red-50 rounded-md text-red-700">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={fetchSessions}
              >
                Try Again
              </Button>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-8 w-8 mx-auto mb-2" />
              <p>No active sessions found</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className={`p-4 rounded-lg border flex items-start justify-between ${session.isCurrent ? "bg-blue-50 border-blue-200" : "bg-white"}`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {getDeviceIcon(session.deviceInfo.deviceType)}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {session.deviceInfo.browser}
                          {session.isCurrent && (
                            <span className="text-xs bg-blue-100 text-blue-800 py-0.5 px-2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.deviceInfo.os}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span title={formatDate(session.lastActive)}>
                            Active {formatTimeAgo(session.lastActive)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          IP: {maskIpAddress(session.deviceInfo.ip)}
                        </div>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogout(session)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Revoke Session</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutAllDialog(true)}
                  disabled={isRevoking || sessions.length <= 1}
                >
                  Sign Out From All Other Devices
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Revoke Session Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign out this device. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSessionLogout}
              disabled={isRevoking}
            >
              {isRevoking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRevoking ? "Revoking..." : "Revoke Session"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Revoke All Sessions Dialog */}
      <AlertDialog
        open={showLogoutAllDialog}
        onOpenChange={setShowLogoutAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Sign Out From All Other Devices?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will sign out from all devices except the current one. Are
              you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeAllSessions}
              disabled={isRevoking}
            >
              {isRevoking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRevoking ? "Signing Out..." : "Sign Out From All Devices"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
