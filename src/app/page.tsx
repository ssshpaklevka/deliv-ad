import Image from "next/image";
import { Orders } from "./1_pages/orders";
import { AdminDashboard } from "./3_features/dashboard";
import ProtectedRoute from "./1_pages/auth/guard/protected-route";

export default function Home() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
