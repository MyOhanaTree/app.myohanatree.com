import React from "react";
import { Link } from "react-router-dom";
import { FamilyFlow } from "../components/FamilyFlow";
import logo from "/myohanatree-logo.png";

const FamilyTreePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-slate-50 to-primary-100">
      <div className="mx-auto w-[1200px] max-w-full px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-3 py-2 shadow-sm">
              <img src={logo} alt="My Ohana Tree logo" className="h-7 w-7 rounded-full border border-primary-100 object-contain bg-white" />
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
          <div className="flex flex-wrap gap-3">
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
          <FamilyFlow />
        </div>
      </div>
    </div>
  );
};

export default FamilyTreePage;
