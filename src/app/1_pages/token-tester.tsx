// components/TokenTester.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import apiClient from "./auth/api/api-client";

const TokenTester = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testProtectedRoute = async () => {
    setLoading(true);
    try {
      // Замените на любой защищенный роут вашего API
      const response = await apiClient.get("/orders"); // или любой другой защищенный роут
      setResult("Success: " + JSON.stringify(response.data));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setResult("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkTokenExpiry = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = new Date(payload.exp * 1000);
        const now = new Date();
        const timeLeft = exp.getTime() - now.getTime();

        setResult(
          `Token expires at: ${exp.toLocaleString()}\nTime left: ${Math.round(timeLeft / 1000)} seconds`,
        );
      } catch (error) {
        setResult("Error parsing token");
      }
    } else {
      setResult("No token found");
    }
  };

  const expireTokenManually = () => {
    // Устанавливаем поддельный истекший токен для тестирования
    const expiredToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjEsImV4cCI6MTAwMDAwMDAwMH0.invalid";
    localStorage.setItem("accessToken", expiredToken);
    setResult("Token manually expired. Try making a request now.");
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold">Token Tester</h3>

      <div className="space-x-2">
        <Button onClick={checkTokenExpiry}>Check Token Expiry</Button>
        <Button onClick={expireTokenManually} variant="outline">
          Expire Token Manually
        </Button>
        <Button onClick={testProtectedRoute} disabled={loading}>
          {loading ? "Testing..." : "Test Protected Route"}
        </Button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
      </div>
    </div>
  );
};

export default TokenTester;
