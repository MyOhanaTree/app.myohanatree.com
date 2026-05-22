export const fieldWrapper = "mb-4";
export const labelWrapper = "mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-700";
export const inputBase =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60";
export const errorText = "mt-1 text-sm text-rose-600";
export const helperText = "mt-1 text-xs text-slate-500";

export const buildSelectStyles = (hasError?: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 44,
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderColor: hasError ? "#f87171" : state.isFocused ? "#8FB3E1" : "#cbd5e1",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(184, 207, 237, 0.7)" : "none",
    "&:hover": { borderColor: state.isFocused ? "#8FB3E1" : "#94a3b8" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: 8,
    padding: 4,
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    borderRadius: 6,
    padding: "8px 12px",
    backgroundColor: state.isSelected ? "#EEF3FB" : state.isFocused ? "#f8fafc" : "#fff",
    color: "#0f172a",
  }),
  singleValue: (base: any, state: any) => ({
    ...base,
    color: state.selectProps.menuIsOpen ? "#64748b" : "#0f172a",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    ":hover": { backgroundColor: "#ef4444", color: "#fff" },
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 50 }),
});
