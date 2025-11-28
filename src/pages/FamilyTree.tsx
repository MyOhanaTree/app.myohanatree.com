import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FamilyFlow } from "../components/FamilyFlow";
import logo from "/myohanatree-logo.png";
import SelectSearch from "@/components/forms/SelectSearch";
import { api } from "@/api/axiosClient";

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-100">
      <div className="mx-auto w-[1200px] max-w-full px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-2 shadow-sm">
              <img src={logo} alt="My Ohana Tree logo" className="h-7 w-7 bg-secondary-500 rounded-full border border-primary-100 object-contain bg-white" />
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
            <Link
              to="/profile"
              className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2"
            >
              View profile
            </Link>
          </div>
        </div>
      </div>

      <div className="flex mx-auto w-[1200px] max-w-full px-4 pb-12 sm:px-6 grow">
        <div className="grow overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-glow">
          <FamilyFlow focusId={focusId} />
        </div>
      </div>
    </div>
  );
};

export default FamilyTreePage;
