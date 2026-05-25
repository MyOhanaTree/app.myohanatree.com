import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { FamilyPerson } from "@/types/family";
import logo from "/myohanatree-logo.png";
import { api } from "@/api/axiosClient";
import { useAuth } from "@/context/AuthContext";

export const Page: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"details" | "documents">("details");

  const [person, setPerson] = useState<FamilyPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);


  useEffect(() => {
    loadPerson();
    loadDocuments();
  }, [id]);

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

    setLoading(true);
    setError(null);
    
    try {
      const { data } = await api.get(`/family/${id}/documents`).catch(() => ({ data: null }));
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setDocuments(items);
    } catch {
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!person) return null;

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
                to={`/person/${id}`}
                className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
              >
                View person
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
          <Link
            to={`/person/${id}`}            
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 border border-primary-200 bg-white text-primary-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md`}
          >
            Details
          </Link>
          <Link
            to={`/person/${id}/documents`}            
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 bg-primary-500 text-secondary-100 shadow-sm`}
          >
            Documents
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">          
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
        </div>
      </div>
    </div>
  );
};

export default Page;
