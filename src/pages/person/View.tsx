import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { FamilyPerson } from "@/types/family";
import logo from "/myohanatree-logo.png";
import { api } from "@/api/axiosClient";
import { useAuth } from "@/context/AuthContext";

export const Page: React.FC = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState<"details" | "documents">("details");

  const [person, setPerson] = useState<FamilyPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const { user } = useAuth();  

  useEffect(() => {
    loadPerson();
  }, [id]);

  useEffect(() => {
    if (activeTab === "documents") {
      loadDocuments();
    }
  }, [activeTab, id]);

  const loadPerson = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/family/${id}`).catch((err) => ({ data: null }));      
      setPerson(data);
    } catch {
      setError("Failed to load person.");
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    if (!id) return;
    setDocumentsLoading(true);
    try {
      const { data } = await api.get(`/family/${id}/documents`).catch(() => ({ data: null }));
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setDocuments(items);
    } catch {
    } finally {
      setDocumentsLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!person) return <div className="p-6 text-red-600">Person not found.</div>;

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.valueOf())) return value;
    return date.toLocaleDateString("en-US");
  };

  const formatLabel = (value?: string) => {
    if (!value) return "-";
    return value
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const personName = (entry: any) => {
    if (!entry) return "-";
    if (typeof entry === "string") return entry;
    const first = entry.firstName || "";
    const last = entry.lastName || "";
    return `${first} ${last}`.trim() || entry.id || "-";
  };

  const parents = Array.isArray(person.parents) ? person.parents : [];
  const relationships = Array.isArray(person.relationships) ? person.relationships : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-100">
      <div className="mx-auto w-[1200px] max-w-full px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-2 shadow-sm">
              <img src={logo} alt="My Ohana Tree logo" className="h-7 w-7 bg-secondary-500 rounded-full border border-primary-100 object-contain" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
                Person Details
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              {person.firstName} {person.lastName}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {user?.permissions?.includes("familyEdit") && (
              <Link
                to={`/person/${id}/edit`}
                className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
              >
                Edit person
              </Link>
            )}
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
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 ${
              activeTab === "details"
                ? "bg-primary-500 text-secondary-100 shadow-sm"
                : "border border-primary-200 bg-white text-primary-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            }`}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 ${
              activeTab === "documents"
                ? "bg-primary-500 text-secondary-100 shadow-sm"
                : "border border-primary-200 bg-white text-primary-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            }`}
          >
            Documents
          </button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {activeTab === "details" && (
            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
              <div className="md:col-span-3">
                <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">First Name</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{person.firstName || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Name</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{person.lastName || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date of Birth</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{formatDate(person.birthDate)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date of Passing</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{formatDate(person.deathDate)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gender</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{formatLabel(person.gender)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Parents</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {parents.length > 0 ? parents.map((entry: any) => personName(entry)).join(", ") : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Relationships</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {relationships.length > 0 ? relationships.map((entry: any) => personName(entry)).join(", ") : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-slate-900">Profile Image</h2>
                <div className="mt-4 flex items-center gap-4 mb-4">
                  <div className="w-full rounded-full border border-slate-200 p-1">
                    {person.profileImage ? (
                      <img src={`${import.meta.env.VITE_ASSETS_URL}/${person.profileImage}`} alt={`${person.firstName}'s profile`} className="aspect-square w-full rounded-full object-cover" />
                    ) : (
                      <div className="flex w-full aspect-square items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">
                        No image
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "documents" && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Documents</h2>
              <p className="mt-1 text-sm text-slate-600">Files attached to this person.</p>
              {documentsLoading && <div className="mt-4 text-sm text-slate-600">Loading documents...</div>}
              {!documentsLoading && documents.length === 0 && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  No documents found.
                </div>
              )}
              {!documentsLoading && documents.length > 0 && (
                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Type</th>
                        <th className="px-4 py-3 font-semibold">Size</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc: any, index: number) => (
                        <tr key={doc?.id || doc?._id || doc?.key || index} className="border-t border-slate-200">
                          <td className="px-4 py-3">{doc?.name || doc?.fileName || doc?.title || "-"}</td>
                          <td className="px-4 py-3">{doc?.type || doc?.mimeType || "-"}</td>
                          <td className="px-4 py-3">{typeof doc?.size === "number" ? `${Math.ceil(doc.size / 1024)} KB` : "-"}</td>
                          <td className="px-4 py-3">{doc?.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-US") : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
