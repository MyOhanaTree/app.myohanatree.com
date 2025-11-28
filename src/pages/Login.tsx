import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "/myohanatree-logo.png";
import TextInput from "@/components/forms/TextInput";
import PasswordInput from "@/components/forms/PasswordInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      const message = JSON.stringify(err) || "Unable to log you in right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-secondary-800 via-secondary-700 to-secondary-900 text-slate-50">
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 lg:px-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-7">

            <img src={logo} alt="My Ohana Tree logo" className="h-auto max-h-[150px] w-auto" />
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Sign in to grow your family story
              </h1>
              <p className="max-w-xl text-lg text-slate-100/80">
                Explore connections, build branches, and keep everyone in the loop with a calm, focused workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-emerald-100">Secure by design</p>
                <p className="mt-1 text-sm text-slate-100/80">Private authentication keeps your tree visible only to your circle.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-emerald-100">Real-time updates</p>
                <p className="mt-1 text-sm text-slate-100/80">Everyone stays synced as new milestones and relatives are added.</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-2xl border bg-secondary-900 border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-lg transition hover:border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">
                  Secure login
                </p>
                <p className="mt-2 text-2xl font-semibold">Welcome back</p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <label className="block space-y-2 text-sm">
                <span className="text-slate-100/80">Email</span>
                <TextInput
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e)}
                  required
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="text-slate-100/80">Password</span>
                <PasswordInput
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e)}
                  required
                />
              </label>

              {error && (
                <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-50">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-base font-semibold text-slate-150 transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Signing in…" : "Login"}
              </button>
            </div>

            <p className="mt-6 text-xs text-slate-100/70">
              By continuing, you agree to keep your family details safe and to invite only trusted relatives.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
