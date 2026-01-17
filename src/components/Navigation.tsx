"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../components/ui/use-toast";
import { Menu, X, ChevronDown } from "lucide-react";
import { NotificationPanel } from "../components/ui/NotificationPanel";
import OptimizedImage from "../components/ui/optimized-image";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
}

export default function Navigation() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("nav")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        // User is not logged in, but we don't show an error
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Listen for profile picture updates
  useEffect(() => {
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { profilePicture } = customEvent.detail;

      // If we have user data, update the profile picture
      if (user) {
        setUser({
          ...user,
          profilePicture,
        });
      }
    };

    // Add event listener for custom event
    window.addEventListener("user-profile-updated", handleProfileUpdate);

    // Clean up
    return () => {
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  // Navigation links for authenticated users
  const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/templates", label: "Email Templates" },
    { href: "/dashboard/contacts", label: "Contact Lists" },
    { href: "/dashboard/history", label: "Email History" },
  ];

  // Navigation links for mobile menu
  const getNavLinks = () => {
    if (user) {
      return authLinks;
    } else {
      return [
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="flex items-center mr-8">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold" style={{ color: "#6B28D9" }}>Sendly</span>
          </Link>
        </div>

        {user && (
          <div className="hidden md:flex flex-1 items-center">
            <div className="flex space-x-8">
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-2 py-0.5 text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 md:flex-none" />

        {!user && (
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-white hover:bg-primary/90 transition-colors duration-200"
            >
              Register
            </Link>
          </div>
        )}

        {user && (
          <div className="hidden md:flex md:items-center md:ml-6">
            <div className="mr-4">
              <NotificationPanel />
            </div>

            {isLoading ? (
              <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center space-x-1.5 rounded-md border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  {user.profilePicture ? (
                    <OptimizedImage
                      src={user.profilePicture}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="block border-b border-gray-100 px-4 py-2 text-sm text-gray-700">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`transform transition-all duration-300 ease-in-out md:hidden fixed top-14 bottom-0 right-0 w-64 bg-white shadow-lg z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="divide-y divide-gray-200 h-full overflow-y-auto">
          {user && (
            <div className="flex items-center space-x-3 px-4 py-4 bg-gray-50">
              {user.profilePicture ? (
                <OptimizedImage
                  src={user.profilePicture}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
          )}

          <div className="space-y-2 px-4 py-3">
            {getNavLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-md px-3 py-2.5 text-base font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user && (
            <div className="space-y-2 px-4 py-3">
              {/* Add Notifications to mobile menu */}
              <div className="flex items-center justify-between rounded-md px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <span>Notifications</span>
                <NotificationPanel />
              </div>

              <Link
                href="/dashboard/profile"
                className="block rounded-md px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full rounded-md px-3 py-2.5 text-left text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
