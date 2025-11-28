import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchFamilyPerson, updateFamilyPerson } from "../api/family";
import type { FamilyPerson } from "../types/family";
import logo from "/myohanatree-logo.png";
import SelectDate from "@/components/forms/SelectDate";
import SelectSearch from "@/components/forms/SelectSearch";
import TextInput from "@/components/forms/TextInput";
import { api } from "@/api/axiosClient";
import { useAuth } from "../context/AuthContext";

export const PersonPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [person, setPerson] = useState<FamilyPerson | null>(null);
  const [form, setForm] = useState<Partial<FamilyPerson>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    loadPerson();
  }, [id]);

  const loadPerson = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchFamilyPerson(id);
      setPerson(data);
      setForm(data);
    } catch {
      setError("Failed to load person.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    try {
      await updateFamilyPerson(id, form);
      await loadPerson();
    } catch {
      alert("Failed to update person.");
    } finally {
      setSaving(false);
    }
  };

  const getMembers = async ({ query = {}, controller = null, excludeInterceptor = false}: any) => {		
    const params: any = {params : query, excludeInterceptor}
    if(controller?.signal){
      params.signal = controller.signal
    }
    const res = await api.get("/family/all", params).catch((err) => ({ data: { items: [] } }))
    return res?.data;
  };

  if(user && !user.permissions.includes("familyEdit")) return <div className="p-6">Unauthorized</div>;
  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!person) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-100">
      <div className="mx-auto w-[1200px] max-w-full px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-2 shadow-sm">
              <img src={logo} alt="My Ohana Tree logo" className="h-7 w-7 bg-secondary-500 rounded-full border border-primary-100 object-contain bg-white" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                Person Details
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              {person.firstName} {person.lastName}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              View family tree
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-[1200px] max-w-full px-4 pb-12 sm:px-6 grow">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="grid gap-4">
            <TextInput
              name="firstName"
              label="First Name"
              value={form.firstName}
              onChange={(val: any) => setForm(prev => ({ ...prev, firstName: val }))}
            />
            <TextInput
              name="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={(val: any) => setForm(prev => ({ ...prev, lastName: val }))}
            /> 

            <SelectDate
              name="birthDate"
              label="Date of Birth"
              value={form.birthDate && (new Date(form.birthDate + " 00:00:00").valueOf() / 1000)}
              onChange={(val: any) => setForm(prev => ({ ...prev, birthDate: new Date(val * 1000).toLocaleDateString('en-CA') }))}
            />   
            <SelectDate
              name="deathDate"
              label="Date of Passing"
              value={form.deathDate && (new Date(form.deathDate + " 00:00:00").valueOf() / 1000)}
              onChange={(val: any) => setForm(prev => ({ ...prev, deathDate: new Date(val * 1000).toLocaleDateString('en-CA') }))}
            />                              
            <SelectSearch
              api={getMembers} // Replace with actual API to fetch members
              label="Parents"
              value={form.parents?.map(p => p.id) || []}
              onChange={(val: any) => setForm(prev => ({ ...prev, parents: val }))}
              keyLabel={["firstName","lastName"]}
              labelDivider=" "                  
              multiple
              preload
            />
            <SelectSearch
              api={getMembers}
              label="Relationship (spouce, partner, etc.)"
              value={form.relationships?.map(p => p.id) || []}
              onChange={(val: any) => setForm(prev => ({ ...prev, relationships: val }))}
              keyLabel={["firstName","lastName"]}
              labelDivider=" " 
              preload                                   
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonPage;