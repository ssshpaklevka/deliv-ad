"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useAuth } from "../context/auth-context";

const AuthForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [step, setStep] = useState<"phone" | "sms">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { sendPhone, login } = useAuth();

  // Функция для форматирования номера телефона
  const formatPhoneNumber = (value: string): string => {
    // Удаляем все символы кроме цифр
    const digits = value.replace(/\D/g, "");

    // Если начинается с 8, заменяем на 7
    if (digits.startsWith("8")) {
      return "+7" + digits.slice(1);
    }

    // Если начинается с 7, добавляем +
    if (digits.startsWith("7")) {
      return "+" + digits;
    }

    // Если начинается с 9, добавляем +7
    if (digits.startsWith("9")) {
      return "+7" + digits;
    }

    // Если есть цифры, добавляем +7
    if (digits.length > 0) {
      return "+7" + digits;
    }

    return value;
  };

  // Валидация номера телефона
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+7[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    // Ограничиваем длину до +7 + 10 цифр
    if (formatted.length <= 12) {
      setPhoneNumber(formatted);
    }
  };

  const handleSendPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Валидация перед отправкой
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Номер телефона должен быть в формате +79001234567");
      setLoading(false);
      return;
    }

    try {
      await sendPhone(phoneNumber);
      setStep("sms");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.message || "Ошибка отправки SMS");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySms = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== VERIFY SMS START ===");
    console.log("Phone:", phoneNumber);
    console.log("SMS Code:", smsCode);
    console.log("SMS Code length:", smsCode.length);

    setLoading(true);
    setError("");

    try {
      console.log("🚀 Calling login function...");
      await login(phoneNumber, smsCode);
      console.log("✅ Login successful!");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Login error:", error);
      console.log("Error type:", typeof error);
      console.log("Error response:", error.response);
      console.log("Error message:", error.message);
      console.log("Full error object:", JSON.stringify(error, null, 2));

      // Более детальная обработка ошибок
      if (error.response) {
        // Запрос ушёл, получен ответ с ошибкой
        console.log("📡 Response status:", error.response.status);
        console.log("📡 Response data:", error.response.data);
        setError(error.response.data?.message || "Неверный код");
      } else if (error.request) {
        // Запрос ушёл, но ответа нет
        console.log("📡 Request was made but no response:", error.request);
        setError("Нет ответа от сервера");
      } else {
        // Ошибка до отправки запроса
        console.log("⚠️ Error before request:", error.message);
        setError(error.message || "Ошибка отправки запроса");
      }
    } finally {
      setLoading(false);
      console.log("=== VERIFY SMS END ===");
    }
  };

  if (step === "phone") {
    return (
      <form onSubmit={handleSendPhone} className="space-y-4">
        <div>
          <Input
            type="tel"
            placeholder="+79001234567"
            value={phoneNumber}
            onChange={handlePhoneChange}
            required
            className={error ? "border-red-500" : ""}
          />
          <p className="text-xs text-gray-500 mt-1">Формат: +79001234567</p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={loading || !validatePhoneNumber(phoneNumber)}
          className="w-full"
        >
          {loading ? "Отправка..." : "Отправить SMS"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifySms} className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Код отправлен на номер {phoneNumber}
        </p>
        <Input
          type="text"
          placeholder="Код из SMS"
          value={smsCode}
          onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ""))} // только цифры
          required
          maxLength={6}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={loading || smsCode.length < 4}
        className="w-full"
      >
        {loading ? "Проверка..." : "Войти"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setStep("phone");
          setSmsCode("");
          setError("");
        }}
        className="w-full"
      >
        Изменить номер
      </Button>
    </form>
  );
};

export default AuthForm;
