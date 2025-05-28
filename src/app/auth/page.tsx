"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, registerStoreUser } from "@/lib/api/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

const AuthPage = () => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Please fill all login fields");
      return;
    }
    try {
      const res = await loginUser(loginData);
      if (res && res.token) {
        toast.success(
          `Welcome back, ${
            res.user_display_name || res.user_nicename || loginData.username
          }!`
        );

        // IMPORTANT: Save token and user info to your auth store
        setAuth(res.token, {
          name:
            res.user_display_name || res.user_nicename || loginData.username,
          email: res.user_email || "", // or res.user?.email depending on API
        });

        // Redirect to my-account page
        router.push("/my-account");
      } else {
        toast.error("Login failed: Invalid credentials");
      }
    } catch {
      toast.error("Login error, please try again");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
      toast.error("Please fill all required registration fields");
      return;
    }
    try {
      const res = await registerStoreUser(registerData);
      if (res && res.id) {
        toast.success(`Registration successful! Welcome ${res.username}`);
        setRegisterData({
          username: "",
          email: "",
          password: "",
          first_name: "",
          last_name: "",
        });
      } else {
        toast.error("Registration failed");
      }
    } catch {
      toast.error("Registration error, please try again");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <ToastContainer />
      <Tabs defaultValue="login" className="space-y-4">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* LOGIN TAB */}
        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username-login">Username</Label>
              <Input
                id="username-login"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password-login">Password</Label>
              <Input
                id="password-login"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </TabsContent>

        {/* REGISTER TAB */}
        <TabsContent value="register">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username-register">Username</Label>
              <Input
                id="username-register"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={registerData.username}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email-register">Email</Label>
              <Input
                id="email-register"
                name="email"
                type="email"
                placeholder="Your email address"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password-register">Password</Label>
              <Input
                id="password-register"
                name="password"
                type="password"
                placeholder="Create a password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="first_name-register">First Name</Label>
              <Input
                id="first_name-register"
                name="first_name"
                type="text"
                placeholder="Your first name"
                value={registerData.first_name}
                onChange={handleRegisterChange}
              />
            </div>
            <div>
              <Label htmlFor="last_name-register">Last Name</Label>
              <Input
                id="last_name-register"
                name="last_name"
                type="text"
                placeholder="Your last name"
                value={registerData.last_name}
                onChange={handleRegisterChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
