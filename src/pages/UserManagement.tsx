import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "/myohanatree-logo.png";
import TextInput from "@/components/forms/TextInput";
import { api } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

type UserRecord = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  createdAt?: string;
  status?: number;
  verifiedAt?: string;
  permissions?: string[];
};

const statusLabel = (status?: number) => {
  if (status === 1) return "Active";
  if (status === 0) return "Invited";
  return "Unknown";
};

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [rowAction, setRowAction] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ email: "", firstName: "", lastName: "" });
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [fromCursor, setFromCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const canManage = useMemo(() => user?.permissions?.includes("userAccess"), [user]);
  const canEdit = useMemo(() => user?.permissions?.includes("userEdit"), [user]);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async (cursor: string | null = null, resetPaging = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/users", {
        params: { search: search || undefined, limit: 20, from: cursor || undefined },
      });
      const items = res?.data?.items || res?.data || [];
      const nextKey = res?.data?.lastKey ?? null;
      setUsers(items);
      setLastKey(nextKey);
      if (resetPaging) {
        setPrevCursors([]);
        setPage(1);
        setFromCursor(null);
      } else if (cursor) {
        setFromCursor(cursor);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to load users right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (!lastKey) return;
    setPrevCursors((prev) => [...prev, fromCursor || ""]);
    loadUsers(lastKey);
    setPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    const prev = [...prevCursors];
    const last = prev.pop();
    setPrevCursors(prev);
    loadUsers(last || null);
    setPage((p) => Math.max(1, p - 1));
    setFromCursor(last || null);
  };

  const handleSearch = () => {
    loadUsers(null, true);
  };

  const handleInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviteMessage(null);
    setError(null);
    setInviting(true);

    try {
      const body = {
        email: newUser.email,
        firstName: newUser.firstName || undefined,
        lastName: newUser.lastName || undefined,
        permissions: [],
      };
      await api.post("/users/invite", body);
      setInviteMessage("Invitation sent. We’ll email them a link to join.");
      setNewUser({ email: "", firstName: "", lastName: "" });
      await loadUsers();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to send invite right now.";
      setError(message);
    } finally {
      setInviting(false);
    }
  };

  const handleResend = async (id: string) => {
    setRowAction(id);
    setError(null);
    try {
      await api.post(`/users/${id}/invite`);
      await loadUsers();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to resend invite.";
      setError(message);
    } finally {
      setRowAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this user? This cannot be undone.");
    if (!confirmed) return;

    setRowAction(id);
    setError(null);
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to delete user.";
      setError(message);
    } finally {
      setRowAction(null);
    }
  };

  if (!canManage) {
    return <div className="p-6 text-slate-700">You do not have permission to manage users.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-100">
      <div className="mx-auto w-[1200px] max-w-full px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-2 shadow-sm">
              <img src={logo} alt="My Ohana Tree logo" className="h-7 w-7 bg-secondary-500 rounded-full border border-primary-100 object-contain bg-white" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                User Management
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Invite and manage your team
            </h1>
            <p className="text-slate-600">
              Control who can access your family workspace. Invite relatives, resend links, or remove access.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              View family tree
            </Link>
            <Link
              to="/profile"
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-[1200px] max-w-full px-4 pb-12 sm:px-6 grow">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.48fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">Team</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">Users</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-start gap-2">
                  <TextInput
                    placeholder="Search name or email"
                    value={search}
                    onChange={(val) => setSearch(val)}
                    sx={{ minWidth: 220 }}
                  />
                  <button
                    onClick={handleSearch}
                    className="rounded-xl bg-primary-500 px-3 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
                  >
                    Search
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => loadUsers(fromCursor)}
                    className="rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="mt-4 rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">{error}</div>}

            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <div>Page {page}</div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={prevCursors.length === 0}
                  className="rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Prev
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!lastKey}
                  className="rounded-xl bg-primary-500 px-3 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <div className="col-span-5">User</div>
                <div className="col-span-4">Email</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              {loading ? (
                <div className="px-4 py-6 text-sm text-slate-600">Loading users…</div>
              ) : users.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-600">No users found.</div>
              ) : (
                users.map((u) => (
                  <div key={u.id} className="grid grid-cols-12 items-center px-4 py-4 text-sm odd:bg-white even:bg-slate-50/80">
                    <div className="col-span-5">
                      <p className="font-semibold text-slate-900">{u.fullName || [u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}</p>
                      <p className="text-xs text-slate-500">Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</p>
                    </div>
                    <div className="col-span-4 text-slate-800">{u.email}</div>
                    <div className="col-span-2">
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">{statusLabel(u.status)}</span>
                      {u.verifiedAt ? <p className="mt-1 text-xs text-emerald-600">Verified</p> : <p className="mt-1 text-xs text-amber-600">Pending</p>}
                    </div>
                    <div className="col-span-1 ml-auto flex flex-col items-end gap-2">
                      <Link
                        to={`/users/${u.id}`}
                        className="text-xs font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-900"
                      >
                        Edit
                      </Link>
                      {canEdit && (
                        <>
                          {!u.verifiedAt && (                        
                            <button
                              onClick={() => handleResend(u.id)}
                              disabled={rowAction === u.id}
                              className="text-xs font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 hover:text-primary-900 disabled:opacity-60"
                            >
                              {rowAction === u.id ? "Sending…" : "Resend"}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={rowAction === u.id}
                            className="text-xs font-semibold text-rose-600 underline decoration-rose-200 underline-offset-4 hover:text-rose-700 disabled:opacity-60"
                          >
                            {rowAction === u.id ? "Deleting…" : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">Invite</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">Invite a new user</p>
            <p className="mt-1 text-sm text-slate-600">
              Send a secure invitation email. They’ll set their own password and join your workspace.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleInvite}>
              <TextInput
                label="Email"
                type="email"
                placeholder="relative@example.com"
                value={newUser.email}
                onChange={(val) => setNewUser((prev) => ({ ...prev, email: val }))}
                required
              />
              <TextInput
                label="First name"
                placeholder="First name"
                value={newUser.firstName}
                onChange={(val) => setNewUser((prev) => ({ ...prev, firstName: val }))}
              />
              <TextInput
                label="Last name"
                placeholder="Last name"
                value={newUser.lastName}
                onChange={(val) => setNewUser((prev) => ({ ...prev, lastName: val }))}
              />

              {inviteMessage && (
                <div className="rounded-xl border border-emerald-400/60 bg-emerald-400/15 px-4 py-3 text-sm text-emerald-700">
                  {inviteMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={inviting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 text-white px-4 py-3 text-base font-semibold text-slate-150 transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {inviting ? "Sending invite…" : "Send invite"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
