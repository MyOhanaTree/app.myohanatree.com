import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "/myohanatree-logo.png";
import TextInput from "@/components/forms/TextInput";
import PasswordInput from "@/components/forms/PasswordInput";
import SelectSearch from "@/components/forms/SelectSearch";
import Checkbox from "@/components/forms/Checkbox";
import { api } from "../api/axiosClient";

type EditableUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  personId?: string;
  permissions?: string[];
};

const permissionOptions = [
  { key: "userAccess", label: "User access" },
  { key: "userEdit", label: "User edit" },
  { key: "userDelete", label: "User delete" },
  { key: "familyCreate", label: "Family create" },
  { key: "familyEdit", label: "Family edit" },
  { key: "familyDelete", label: "Family delete" },
];

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<EditableUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    if (!id) return;
    loadUser(id);
  }, [id]);

  const loadUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/users/${userId}`);
      setUser(res?.data);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to load user.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getMembers = async ({ query = {}, controller = null, excludeInterceptor = false }: any) => {
    const params: any = { params: query, excludeInterceptor };
    if (controller?.signal) {
      params.signal = controller.signal;
    }
    const res = await api.get("/family/all", params).catch(() => ({ data: { items: [] } }));
    return res?.data;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !user) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const body: any = {
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        personId: user.personId || undefined,
        permissions: user.permissions || [],
      };

      if (password || passwordConfirm) {
        body.password = password;
        body.passwordConfirm = passwordConfirm;
      }

      await api.put(`/users/${id}`, body);
      setSuccess("User updated.");
      setPassword("");
      setPasswordConfirm("");
      await loadUser(id);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to update user.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading user…</div>;
  if (error && !user) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-100">
      <div className="mx-auto w-[1200px] max-w-full px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-2 shadow-sm">
              <img src={logo} alt="My Ohana Tree logo" className="h-7 w-7 bg-secondary-500 rounded-full border border-primary-100 object-contain bg-white" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                Edit User
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              {fullName}
            </h1>
            <p className="text-slate-600">
              Update details or link this account to an existing family member.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/users"
              className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              Back to users
            </Link>
            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              View tree
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-[1200px] max-w-full px-4 pb-12 sm:px-6 grow">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Email"
              value={user.email}
              readonly
              placeholder="email@example.com"
            />
            <TextInput
              label="First name"
              value={user.firstName}
              onChange={(val) => setUser((prev) => ({ ...prev!, firstName: val }))}
              placeholder="First name"
            />
            <TextInput
              label="Last name"
              value={user.lastName}
              onChange={(val) => setUser((prev) => ({ ...prev!, lastName: val }))}
              placeholder="Last name"
            />
            <SelectSearch
              api={getMembers}
              label="Attach to family member"
              placeholder="Search family member"
              value={user.personId ? [user.personId] : []}
              onChange={(val: any) => setUser((prev) => ({ ...prev!, personId: val?.id || val?.value || "" }))}
              keyLabel={["firstName", "lastName"]}
              labelDivider=" "
              preload
            />
            <PasswordInput
              label="New password"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(val) => setPassword(val)}
            />
            <PasswordInput
              label="Confirm new password"
              placeholder="Re-enter password"
              value={passwordConfirm}
              onChange={(val) => setPasswordConfirm(val)}
            />
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
              Permissions
            </p>
            <p className="text-sm text-slate-600">Toggle the capabilities for this user.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {permissionOptions.map((perm) => {
                const checked = user.permissions?.includes(perm.key) ?? false;
                return (
                  <Checkbox
                    key={perm.key}
                    label={perm.label}
                    checked={checked}
                    onChange={(val) =>
                      setUser((prev) => {
                        if (!prev) return prev;
                        const current = prev.permissions || [];
                        const next = val
                          ? Array.from(new Set([...current, perm.key]))
                          : current.filter((p) => p !== perm.key);
                        return { ...prev, permissions: next };
                      })
                    }
                  />
                );
              })}
            </div>
          </div>

          {error && <div className="mt-4 rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">{error}</div>}
          {success && <div className="mt-4 rounded-xl border border-emerald-400/60 bg-emerald-400/15 px-4 py-3 text-sm text-emerald-700">{success}</div>}

          <div className="mt-6 flex justify-end gap-3">
            <Link
              to="/users"
              className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
