import React, { useEffect, useState } from "react";

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
      className="flex items-start gap-3"
      style={sx}
      onClick={(e) => e.stopPropagation()}
    >
      <label
        className={`flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700 transition ${className || ""}`}
      >
        <input
          disabled={$disabled}
          type="checkbox"
          name={name}
          value={value ?? 1}
          checked={newChecked}
          onChange={setSelectValue}
          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed"
        />
        {label}
      </label>
    </div>
  );
};
export default Checkbox;
