import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { FamilyPerson } from "../types/family";
import logo from "/myohanatree-logo.png";
import SelectDate from "@/components/forms/SelectDate";
import SelectSearch from "@/components/forms/SelectSearch";
import TextInput from "@/components/forms/TextInput";
import { api } from "@/api/axiosClient";
import { useAuth } from "../context/AuthContext";
import SelectInput from "@/components/forms/SelectInput";
import FileInput from "@/components/forms/FileInput";

export const PersonPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"details" | "documents">("details");

  const [person, setPerson] = useState<FamilyPerson | null>(null);
  const [form, setForm] = useState<Partial<FamilyPerson>>({});
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);


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
      await api.put(`/family/${id}`, form).catch((err) => ({ data: null }));            
      await loadPerson();
    } catch {
      alert("Failed to update person.");
    } finally {
      setSaving(false);
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

  const handleNewImageSave = async () => {
    if(newImageFile == null || !id) return;

    const extension = newImageFile.name.split(".").pop() || "jpg";
    const fileName = `profile-image.${extension}`;

    const { data } = await api.post(`/media/presigned-url`,{
      "name": fileName,
      "type": newImageFile?.type,
      "size": newImageFile?.size,
      "directory": `${id}/profile-images`
    }).catch((err) => ({ data: null }));

    if(!data) {
      alert("Failed to upload image.");
      return;
    }

    if(!data.success) {
      alert(data.message || "Failed to upload image.");
      return;
    }

    const { url, location, headers: signedHeaders } = data;

    try {
      const uploadHeaders = new Headers();
      if (signedHeaders && typeof signedHeaders === "object") {
        Object.entries(signedHeaders).forEach(([key, value]) => {
          if (typeof value === "string") uploadHeaders.set(key, value);
        });
      }
      if (newImageFile.type && !uploadHeaders.has("Content-Type")) {
        uploadHeaders.set("Content-Type", newImageFile.type);
      }

      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: uploadHeaders,
        body: newImageFile
      });
      if (!uploadRes.ok) {
        const errBody = await uploadRes.text().catch(() => "");
        console.error("S3 upload failed", {
          status: uploadRes.status,
          statusText: uploadRes.statusText,
          body: errBody,
          requestHeaders: Object.fromEntries(uploadHeaders.entries()),
        });
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      await api.post(`/family/${id}/profile-image`, { directory: location }).catch((err) => ({ data: null }));
      await loadPerson();
      setNewImageFile(null);
      setShowImageModal(false);
    } catch (err) {
      alert("Failed to upload image.");
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

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await api.delete(`/family/${id}`);
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete person.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
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
                <p className="mt-1 text-sm text-slate-600">Edit the person's basic details here.</p>
                <form onSubmit={handleSave}>
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
                      onChange={(val: any) => setForm(prev => ({ ...prev, birthDate: new Date(val * 1000).toLocaleDateString("en-CA") }))}
                    />
                    <SelectDate
                      name="deathDate"
                      label="Date of Passing"
                      value={form.deathDate && (new Date(form.deathDate + " 00:00:00").valueOf() / 1000)}
                      onChange={(val: any) => setForm(prev => ({ ...prev, deathDate: new Date(val * 1000).toLocaleDateString("en-CA") }))}
                    />
                    <SelectInput
                      label="Gender"
                      options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Non Binary", value: "non-binary" },
                        { label: "Other", value: "other" },
                      ]}
                      value={form.gender}
                      onChange={(val: any) => setForm((prev) => ({ ...prev, gender: val }))}
                      placeholder="Select gender"
                    />
                    <SelectSearch
                      api={getMembers}
                      label="Parents"
                      value={(form.parents || []).map((p: any) => (typeof p === "object" ? p?.id : p)).filter(Boolean)}
                      onChange={(val: any) => setForm(prev => ({ ...prev, parents: val }))}
                      keyLabel={["firstName", "lastName"]}
                      labelDivider=" "
                      multiple
                      preload
                    />
                    <SelectSearch
                      api={getMembers}
                      label="Relationship (spouce, partner, etc.)"
                      value={(form.relationships || []).map((p: any) => (typeof p === "object" ? p?.id : p)).filter(Boolean)}
                      onChange={(val: any) => setForm(prev => ({ ...prev, relationships: val }))}
                      keyLabel={["firstName", "lastName"]}
                      labelDivider=" "
                      multiple
                      preload
                    />
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2"
                    >
                      Delete
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-slate-900">Profile Image</h2>
                <div className="mt-4 flex items-center gap-4 mb-4">
                  <div
                    onClick={() => setShowImageModal(true)}
                    className="cursor-pointer w-full rounded-full border border-slate-200 p-1 hover:shadow-md transition"
                  >
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">Confirm delete</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Remove this person?</p>
            <p className="mt-1 text-sm text-slate-600">
              This will delete the person record from your family tree. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">Profile image</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Upload new profile image</p>
            <p className="mt-1 text-sm text-slate-600">Choose an image file and save it to this person profile.</p>
            <div className="mt-4">
              <FileInput 
                accept="image/*"
                types={["image/jpeg", "image/png", "image/gif"]}
                label="Upload new image"
                multiple={false}
                onChange={(files: any) => {
                  const file = Array.isArray(files) ? files[0] : files;
                  setNewImageFile(file);
                }}
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false);
                  setNewImageFile(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newImageFile}
                onClick={handleNewImageSave}
                className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-secondary-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                Save image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonPage;
