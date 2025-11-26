import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "/myohanatree-logo.png";

export default function Profile() {
  const { user, logout } = useAuth();
  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Explorer";

  const email = user?.email || user?.username || "Not provided";
  const status = user ? "Authenticated" : "Guest";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Recently joined";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-100">
      <div className="mx-auto w-[1200px] max-w-full px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-2 shadow-sm">
              <img src={logo} alt="My Ohana Tree logo" className="h-7 w-7 rounded-full border border-primary-100 object-contain bg-white" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                Profile
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Welcome, {displayName}
            </h1>
            <p className="text-slate-600">
              Manage your account, review your details, and jump back into your family tree.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              View family tree
            </Link>
            <button
              onClick={logout}
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                  Overview
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">Profile snapshot</p>
              </div>
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                {status}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Name
                </dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">{displayName}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Email / Username
                </dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">{email}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Member since
                </dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">{memberSince}</dd>
              </div>              
            </dl>
          </div>          
        </div>
      </div>
    </div>
  );
}
