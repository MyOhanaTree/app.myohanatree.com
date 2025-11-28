import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import logo from "/myohanatree-logo.png";
import PasswordInput from "@/components/forms/PasswordInput";
import TextInput from "@/components/forms/TextInput";
import { api } from "../api/axiosClient";

type TokenStatus = "idle" | "checking" | "valid" | "invalid";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const initialToken = searchParams.get("token");
    if (initialToken) {
      setToken(initialToken);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const verifyToken = async () => {
      if (!token) {
        setTokenStatus("idle");
        return;
      }
      setTokenStatus("checking");
      setError(null);

      try {
        await api.post("/auth/reset-password-check", { token });
        if (!cancelled) setTokenStatus("valid");
      } catch (err: any) {
        if (!cancelled) {
          const message = err?.response?.data?.message || "This reset link looks invalid or expired.";
          setTokenStatus("invalid");
          setError(message);
        }
      }
    };

    verifyToken();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Missing reset link. Please request a new email.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/reset-password", { token, password, passwordConfirm });
      const message = res?.data?.message || "Your password has been updated. You can now sign in.";
      setSuccess(message);
    } catch (err: any) {
      const message = err?.response?.data?.message || "We couldn’t update your password right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const tokenHelper = (() => {
    switch (tokenStatus) {
      case "checking":
        return "Checking your reset link…";
      case "valid":
        return "Reset link verified.";
      case "invalid":
        return "Link looks invalid or expired. Paste a fresh token or request a new email.";
      default:
        return "Paste the token from your email or use the link directly.";
    }
  })();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-secondary-900 via-secondary-700 to-secondary-900 text-slate-50">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12 lg:px-10">
        <div className="mb-10 flex items-center justify-center">
          <img src={logo} alt="My Ohana Tree logo" className="h-auto max-h-[120px] w-auto" />
        </div>

        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Reset password</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Choose a strong new password
              </h1>
              <p className="max-w-xl text-lg text-slate-100/80">
                Set a fresh password to get back into your family tree.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-emerald-100">Tips for a secure password</p>
              <p className="mt-1 text-sm text-slate-100/80">
                Use at least 8 characters, mixing letters, numbers, and symbols. Avoid names or birthdays that relatives might guess.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-lg transition hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Secure update</p>
                <p className="mt-2 text-2xl font-semibold">Reset your password</p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <label className="block space-y-2 text-sm">
                <span className="text-slate-100/80">New password</span>
                <PasswordInput
                  placeholder="••••••••"
                  value={password}
                  onChange={(value) => setPassword(value)}
                  required
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="text-slate-100/80">Confirm new password</span>
                <PasswordInput
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(value) => setPasswordConfirm(value)}
                  required
                />
              </label>

              {error && (
                <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-50">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-400/60 bg-emerald-400/15 px-4 py-3 text-sm text-emerald-50">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || tokenStatus === "checking"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-base font-semibold text-slate-150 transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Updating…" : "Update password"}
              </button>
            </div>
            <p className="mt-6">
              <Link to="/login" className="text-sm font-semibold text-emerald-100 underline decoration-white/40 underline-offset-4">
                Back to login
              </Link>
            </p>
            <p className="mt-6 text-xs text-slate-100/70">
              If your link expired, request a new reset email and paste the latest token here.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
