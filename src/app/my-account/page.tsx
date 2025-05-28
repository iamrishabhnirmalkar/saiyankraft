"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!token) return <p>Redirecting...</p>;
  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 font-medium">Name:</p>
            <p className="text-lg">{user.name || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-600 font-medium">Email:</p>
            <p className="text-lg">{user.email || "N/A"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
