import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import logo from "/myohanatree-logo.png";
import TextInput from "@/components/forms/TextInput";
import { api } from "../api/axiosClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      if(res?.data?.success){
        const message = res?.data?.message || "Check your email for a link to reset your password.";
        setSuccess(message);
      } else {
        const message = res?.data?.message || "We couldn't process your request right now.";
        setError(message);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "We couldn't send the reset email right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-secondary-900 via-secondary-700 to-secondary-900 text-slate-50">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12 lg:px-10">
        <div className="mb-10 flex items-center justify-center">
          <img src={logo} alt="My Ohana Tree logo" className="h-auto max-h-[120px] w-auto" />
        </div>

        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Reset access</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Forgot your password?
              </h1>
              <p className="max-w-xl text-lg text-slate-100/80">
                We’ll email you a secure link to choose a new password. Keep an eye on your inbox and spam folder.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-emerald-100">Privacy-first</p>
              <p className="mt-1 text-sm text-slate-100/80">
                We never send your password. Links expire automatically to keep your family details protected.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-lg transition hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Email link</p>
                <p className="mt-2 text-2xl font-semibold">Send reset instructions</p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <label className="block space-y-2 text-sm">
                <span className="text-slate-100/80">Email</span>
                <TextInput
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(value) => setEmail(value)}
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
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-base font-semibold text-slate-150 transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending…" : "Email me a reset link"}
              </button>
            </div>
            <p className="mt-6">
              <Link to="/login" className="text-sm font-semibold text-emerald-100 underline decoration-white/40 underline-offset-4">
                Back to login
              </Link>
            </p>
            <p className="mt-6 text-xs text-slate-100/70">
              We respect your privacy. If you don’t see the email within a few minutes, check spam or request a fresh link.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
