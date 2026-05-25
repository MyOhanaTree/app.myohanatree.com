import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { FamilyPerson } from "@/types/family";
import logo from "/myohanatree-logo.png";
import SelectDate from "@/components/forms/SelectDate";
import SelectSearch from "@/components/forms/SelectSearch";
import TextInput from "@/components/forms/TextInput";
import { api } from "@/api/axiosClient";
import { useAuth } from "@/context/AuthContext";
import SelectInput from "@/components/forms/SelectInput";
import FileInput from "@/components/forms/FileInput";

type ParentType =
  | "parent"
  | "biological parent"
  | "step parent"
  | "adoptive parent"
  | "guardian"
  | "other";

type ParentRow = {
  id: string;
  type: ParentType;
};

type ChildType = ParentType;

type ChildRow = {
  id: string;
  type: ChildType;
};

type RelationshipRow = {
  id: string;
  startDate?: string;
  endDate?: string;
};

type PersonForm = Omit<Partial<FamilyPerson>, "parents" | "children" | "relationships"> & {
  parents?: ParentRow[];
  children?: ChildRow[];
  relationships?: RelationshipRow[];
};

const parentTypeOptions = [
  { label: "Parent", value: "parent" },
  { label: "Biological Parent", value: "biological parent" },
  { label: "Step Parent", value: "step parent" },
  { label: "Adoptive Parent", value: "adoptive parent" },
  { label: "Guardian", value: "guardian" },
  { label: "Other", value: "other" },
];

const childTypeOptions = parentTypeOptions;

const allowedParentTypes = new Set(parentTypeOptions.map((option) => option.value));
const allowedChildTypes = new Set(childTypeOptions.map((option) => option.value));

const getEntityId = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return String(value.id || value._id || value.personId || value.parentId || value.value || "");
};

const parseParents = (parents: any): ParentRow[] => {
  if (!Array.isArray(parents)) return [];

  return parents.map((parent: any) => {
    const id = getEntityId(parent);
    const rawType = parent?.type || parent?.relationshipType || "parent";
    const type = (allowedParentTypes.has(rawType) ? rawType : "parent") as ParentType;
    return { id, type };
  });
};

const normalizeParents = (parents: any): ParentRow[] => parseParents(parents).filter((parent: ParentRow) => !!parent.id);

const parseChildren = (children: any): ChildRow[] => {
  if (!Array.isArray(children)) return [];

  return children.map((child: any) => {
    const id = getEntityId(child);
    const rawType = child?.type || child?.relationshipType || "parent";
    const type = (allowedChildTypes.has(rawType) ? rawType : "parent") as ChildType;
    return { id, type };
  });
};

const normalizeChildren = (children: any): ChildRow[] => parseChildren(children).filter((child: ChildRow) => !!child.id);

const parseRelationships = (relationships: any): RelationshipRow[] => {
  if (!Array.isArray(relationships)) return [];

  return relationships.map((relationship: any) => ({
    id: getEntityId(relationship),
    startDate: relationship?.startDate || relationship?.relationshipStartDate || "",
    endDate: relationship?.endDate || relationship?.relationshipEndDate || "",
  }));
};

const normalizeRelationships = (relationships: any): RelationshipRow[] =>
  parseRelationships(relationships).filter((relationship: RelationshipRow) => !!relationship.id);

export const Page: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [person, setPerson] = useState<FamilyPerson | null>(null);
  const [form, setForm] = useState<PersonForm>({});
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

  const loadPerson = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/family/${id}`).catch((err) => ({ data: null }));      
      setPerson(data);
      setForm({
        ...data,
        parents: parseParents(data?.parents),
        children: parseChildren(data?.children),
        relationships: parseRelationships(data?.relationships),
      });
    } catch {
      setError("Failed to load person.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        parents: normalizeParents(form.parents),
        children: normalizeChildren(form.children),
        relationships: normalizeRelationships(form.relationships),
      };

      await api.put(`/family/${id}`, payload).catch((err) => ({ data: null }));            
      await loadPerson();
    } catch {
      alert("Failed to update person.");
    } finally {
      setSaving(false);
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
        <div className="mb-4 flex gap-2 justify-between">
          <div className="flex gap-2">
            <Link
              to={`/person/${id}/edit`}            
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 bg-primary-500 text-secondary-100 shadow-sm`}
            >
              Details
            </Link>
            <Link
              to={`/person/${id}/documents`}            
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-2 border border-primary-200 bg-white text-primary-800 shadow-sm hover:-translate-y-0.5 hover:shadow-md`}
            >
              Documents
            </Link>          
          </div>          
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
          <div className="md:col-span-3">            
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
                  <p className="mt-1 text-sm text-slate-600">Edit the person's basic details here.</p>
                  <div className="grid gap-4 mt-2">
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
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-900">Parents</p>
                  <div className="space-y-3">
                    {(parseParents(form.parents)).map((parent: ParentRow, index: number) => (
                      <div key={`${parent.id || "parent"}-${index}`} className="grid grid-cols-1 gap-3 items-center rounded-xl border border-slate-200 p-1 md:grid-cols-[1fr_220px_auto]">
                        <SelectSearch
                          api={getMembers}
                          value={parent.id}
                          onChange={(val: any) => {
                            const parentId = getEntityId(val);
                            setForm((prev) => {
                              const nextParents = parseParents(prev.parents);
                              const current = nextParents[index] || { id: "", type: "parent" as ParentType };
                              nextParents[index] = { id: parentId, type: current.type };
                              return { ...prev, parents: nextParents };
                            });
                          }}
                          keyLabel={["firstName", "lastName", "birthDate"]}
                          labelDivider=" "
                          preload
                          sx={{ marginBottom: 0 }}
                        />
                        <SelectInput
                          options={parentTypeOptions}
                          value={parent.type}
                          onChange={(val: any) => {
                            setForm((prev) => {
                              const nextParents = parseParents(prev.parents);
                              const current = nextParents[index] || { id: "", type: "parent" as ParentType };
                              const nextType = (allowedParentTypes.has(val) ? val : "parent") as ParentType;
                              nextParents[index] = { id: current.id, type: nextType };
                              return { ...prev, parents: nextParents };
                            });
                          }}
                          placeholder="Select type"
                          sx={{ marginBottom: 0 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => {
                              const nextParents = parseParents(prev.parents).filter((_: ParentRow, i: number) => i !== index);
                              return { ...prev, parents: nextParents };
                            });
                          }}
                          className="h-fit self-end rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => {
                          const nextParents = [...parseParents(prev.parents), { id: "", type: "parent" as ParentType }];
                          return { ...prev, parents: nextParents };
                        });
                      }}
                      className="rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Add parent
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-900">Relationships</p>
                  <div className="space-y-3">
                      {parseRelationships(form.relationships).map((relationship: RelationshipRow, index: number) => (
                        <div key={`${relationship.id || "relationship"}-${index}`} className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_180px_180px_auto]">
                          <SelectSearch
                            label={`Relationship #${index + 1}`}
                            api={getMembers}
                            value={relationship.id}
                            onChange={(val: any) => {
                              const relationshipId = getEntityId(val);
                              setForm((prev) => {
                                const nextRelationships = parseRelationships(prev.relationships);
                                const current = nextRelationships[index] || { id: "", startDate: "", endDate: "" };
                                nextRelationships[index] = {
                                  id: relationshipId,
                                  startDate: current.startDate,
                                  endDate: current.endDate,
                                };
                                return { ...prev, relationships: nextRelationships };
                              });
                            }}
                            keyLabel={["firstName", "lastName", "birthDate"]}
                            labelDivider=" "
                            preload
                            sx={{ marginBottom: 0 }}
                          />
                          <SelectDate
                            name={`relationship-start-${index}`}
                            label="Start Date"
                            value={relationship.startDate ? new Date(relationship.startDate + " 00:00:00").valueOf() / 1000 : undefined}
                            onChange={(val: any) => {
                              setForm((prev) => {
                                const nextRelationships = parseRelationships(prev.relationships);
                                const current = nextRelationships[index] || { id: "", startDate: "", endDate: "" };
                                nextRelationships[index] = {
                                  id: current.id,
                                  startDate: new Date(val * 1000).toLocaleDateString("en-CA"),
                                  endDate: current.endDate,
                                };
                                return { ...prev, relationships: nextRelationships };
                              });
                            }}
                            sx={{ marginBottom: 0 }}
                          />
                          <SelectDate
                            name={`relationship-end-${index}`}
                            label="End Date"
                            value={relationship.endDate ? new Date(relationship.endDate + " 00:00:00").valueOf() / 1000 : undefined}
                            onChange={(val: any) => {
                              setForm((prev) => {
                                const nextRelationships = parseRelationships(prev.relationships);
                                const current = nextRelationships[index] || { id: "", startDate: "", endDate: "" };
                                nextRelationships[index] = {
                                  id: current.id,
                                  startDate: current.startDate,
                                  endDate: new Date(val * 1000).toLocaleDateString("en-CA"),
                                };
                                return { ...prev, relationships: nextRelationships };
                              });
                            }}
                            sx={{ marginBottom: 0 }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setForm((prev) => {
                                const nextRelationships = parseRelationships(prev.relationships).filter((_: RelationshipRow, i: number) => i !== index);
                                return { ...prev, relationships: nextRelationships };
                              });
                            }}
                            className="h-fit self-end rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => {
                            const nextRelationships = [...parseRelationships(prev.relationships), { id: "", startDate: "", endDate: "" }];
                            return { ...prev, relationships: nextRelationships };
                          });
                        }}
                        className="rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        Add relationship
                      </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-900">Children</p>
                  <div className="space-y-3">
                    {(parseChildren(form.children)).map((child: ChildRow, index: number) => (
                      <div key={`${child.id || "child"}-${index}`} className="grid grid-cols-1 gap-3 items-center rounded-xl border border-slate-200 p-1 md:grid-cols-[1fr_220px_auto]">
                        <SelectSearch
                          api={getMembers}
                          value={child.id}
                          onChange={(val: any) => {
                            const childId = getEntityId(val);
                            setForm((prev) => {
                              const nextChildren = parseChildren(prev.children);
                              const current = nextChildren[index] || { id: "", type: "parent" as ChildType };
                              nextChildren[index] = { id: childId, type: current.type };
                              return { ...prev, children: nextChildren };
                            });
                          }}
                          keyLabel={["firstName", "lastName", "birthDate"]}
                          labelDivider=" "
                          preload
                          sx={{ marginBottom: 0 }}
                        />
                        <SelectInput
                          options={childTypeOptions}
                          value={child.type}
                          onChange={(val: any) => {
                            setForm((prev) => {
                              const nextChildren = parseChildren(prev.children);
                              const current = nextChildren[index] || { id: "", type: "parent" as ChildType };
                              const nextType = (allowedChildTypes.has(val) ? val : "parent") as ChildType;
                              nextChildren[index] = { id: current.id, type: nextType };
                              return { ...prev, children: nextChildren };
                            });
                          }}
                          placeholder="Select type"
                          sx={{ marginBottom: 0 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => {
                              const nextChildren = parseChildren(prev.children).filter((_: ChildRow, i: number) => i !== index);
                              return { ...prev, children: nextChildren };
                            });
                          }}
                          className="h-fit self-end rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => {
                          const nextChildren = [...parseChildren(prev.children), { id: "", type: "parent" as ChildType }];
                          return { ...prev, children: nextChildren };
                        });
                      }}
                      className="rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      Add child
                    </button>
                  </div>
                </div>
              
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex gap-2">
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
                </div>
              </div>  
            </form>
          </div>
          <div className="md:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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

export default Page;
