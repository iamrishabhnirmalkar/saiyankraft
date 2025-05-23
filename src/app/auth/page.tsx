"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginUser, registerUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const setToken = useAuthStore((state) => state.setToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const res = await loginUser(formData.username, formData.password);
        console.log("✅ Login success:", res);
        setToken(res.token);
        // optionally redirect on login success
        window.location.href = "/";
      } else {
        const res = await registerUser(
          formData.email,
          formData.username,
          formData.password
        );
        console.log("✅ Registration success:", res);
        // after registration, you can auto-switch to login mode
        setIsLogin(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error:", error.message);
      } else {
        console.error("❌ Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold text-center">
            {isLogin ? "Login" : "Register"}
          </h2>
          {!isLogin && (
            <Input
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          )}
          <Input
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </Button>
          <p className="text-sm text-center text-gray-600">
            {isLogin ? "New user?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
