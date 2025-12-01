import React from "react";
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { FamilyFlow } from "../components/FamilyFlow";
import logo from "/myohanatree-logo.png";
import SelectSearch from "@/components/forms/SelectSearch";
import { api } from "@/api/axiosClient";
import TextInput from "@/components/forms/TextInput";
import SelectDate from "@/components/forms/SelectDate";
import SelectInput from "@/components/forms/SelectInput";

const FamilyTreePage: React.FC = () => {
  const [focusId, setFocusId] = useState<string | null>(null);

  const getMembers = async ({ query = {}, controller = null, excludeInterceptor = false }: any) => {		
    const params: any = { params: query, excludeInterceptor };
    if (controller?.signal) {
      params.signal = controller.signal;
    }
    const res = await api.get("/family/all", params).catch(() => ({ data: { items: [] } }));
    return res?.data;
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<{ firstName: string; lastName: string; birthDate?: number; gender?: string }>({
    firstName: "",
    lastName: "",
    birthDate: undefined,
    gender: undefined,
  });

  const handleCreatePerson = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      const body: any = {
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        birthDate: createForm.birthDate ? new Date(createForm.birthDate * 1000).toLocaleDateString("en-CA") : undefined,
        gender: createForm.gender,
      };
      const res = await api.post("/family", body);
      const newId = res?.data?.id;
      setCreateOpen(false);
      setCreateForm({ firstName: "", lastName: "", birthDate: undefined, gender: undefined });
      if (newId) {
        setFocusId(newId);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to create person.";
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-100">
      <div className="mx-auto w-[1200px] max-w-full px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-2 shadow-sm">
              <img src={logo} alt="My Ohana Tree logo" className="h-7 w-7 bg-secondary-500 rounded-full border border-primary-100 object-contain" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                My Ohana Tree
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Visualize your lineage
            </h1>
            <p className="text-slate-600">
              Click any card to recenter the tree on that relative and keep exploring the branches.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-start">            
            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2"
            >
              Add person
            </button>
            <Link
              to="/profile"
              className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2"
            >
              View profile
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col mx-auto w-[1200px] max-w-full px-4 pb-12 sm:px-6 grow">
        <div className="w-64">
          <SelectSearch
            api={getMembers}
            placeholder="Search family member"
            value={focusId || ""}
            onChange={(val: any) => setFocusId(val?.id || val?.value || val || null)}
            keyLabel={["firstName", "lastName"]}
            labelDivider=" "
            preload
          />
        </div>
        <div className="flex grow overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-glow">
          <FamilyFlow focusId={focusId} />
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">New person</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">Create family member</p>
                <p className="text-sm text-slate-600">Add a quick entry and then refine details later.</p>
              </div>
              <button
                onClick={() => setCreateOpen(false)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleCreatePerson}>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="First name"
                  value={createForm.firstName}
                  onChange={(val) => setCreateForm((prev) => ({ ...prev, firstName: val }))}
                  required
                />
                <TextInput
                  label="Last name"
                  value={createForm.lastName}
                  onChange={(val) => setCreateForm((prev) => ({ ...prev, lastName: val }))}
                  required
                />
              </div>
              <SelectDate
                label="Birth date"
                value={createForm.birthDate}
                onChange={(val) => setCreateForm((prev) => ({ ...prev, birthDate: val }))}
              />
              <SelectInput
                label="Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Non Binary", value: "non-binary" },
                  { label: "Other", value: "other" },
                ]}
                value={createForm.gender}
                onChange={(val: any) => setCreateForm((prev) => ({ ...prev, gender: val }))}
                placeholder="Select gender"
              />

              {createError && (
                <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
                  {createError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  {creating ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreePage;
