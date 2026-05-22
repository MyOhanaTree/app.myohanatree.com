import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">
          Checking session…
        </div>
      </div>
    );
  } // wait for auth to load
  if (!user) return <Navigate to="/login" replace />; // redirect if not logged in

  return <>{children}</>;
}
