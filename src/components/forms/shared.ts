export const fieldWrapper = "mb-5";
export const labelWrapper = "mb-2 flex items-center gap-1 text-sm font-semibold text-slate-800";
export const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60";
export const errorText = "mt-1 text-sm text-rose-600";
export const helperText = "mt-1 text-xs text-slate-500";

export const buildSelectStyles = (hasError?: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 44,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderColor: hasError ? "#f87171" : state.isFocused ? "#0ea5e9" : "#e2e8f0",   
    boxShadow: state.isFocused ? "0 0 0 2px rgba(16,185,129,0.25)" : "none",
    "&:hover": { borderColor: "#0ea5e9" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: 12,
    padding: 4,
    boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    borderRadius: 8,
    padding: "8px 12px",
    backgroundColor: state.isSelected ? "#e0f2fe" : state.isFocused ? "#f8fafc" : "#fff",
    color: "#0f172a",
  }),
  singleValue: (base: any, state: any) => ({
    ...base,
    color: state.selectProps.menuIsOpen ? "#80879b" : "#0f172a",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#e2e8f0",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    ":hover": { backgroundColor: "#ef4444", color: "#fff" },
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 50 }),
});
