import React, { useEffect, useState } from "react";
import { fieldWrapper } from "../shared";

type CheckboxProps = {
  name?: string;
  label?: string | React.ReactNode;
  value?: string | number;
  checked?: boolean;
  className?: string;
  onChange?: (e?: any) => void;
  sx?: React.CSSProperties;
  $disabled?: boolean;
};

const Checkbox = ({
  name,
  label,
  value,
  checked,
  onChange,
  sx,
  $disabled,
  className,
}: CheckboxProps) => {
  const [newChecked, setNewChecked] = useState<boolean>(checked || false);

  const setSelectValue = function () {
    if (typeof onChange === "function") {
      onChange(!newChecked);
    }
  };

  useEffect(() => {
    setNewChecked(checked || false);
  }, [checked]);

  return (
    <div
      className={`${fieldWrapper} flex items-start gap-3 ${className || ""}`}
      style={sx}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        disabled={$disabled}
        type="checkbox"
        name={name}
        value={value ?? 1}
        checked={newChecked}
        onChange={setSelectValue}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 shadow-sm transition focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      />
      {label && (
        <button
          type="button"
          onClick={() => typeof onChange === "function" && onChange(!newChecked)}
          className="text-sm font-semibold text-slate-800 hover:text-slate-900 focus:outline-none"
        >
          {label}
        </button>
      )}
    </div>
  );
};
export default Checkbox;
