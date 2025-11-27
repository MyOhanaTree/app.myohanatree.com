import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { fieldWrapper, inputBase } from "../shared";

type SearchFieldProps = {
  name?: string;
  value?: string | number;
  width?: string;
  className?: string;
  sx?: React.CSSProperties;
  onChange?: (e?: any) => void;
  onKeyUp?: (e?: any) => void;
  onBlur?: (e?: any) => void;
};

const SearchField = ({
  name = "",
  value = "",
  width = "200px",
  className,
  sx,
  onChange,
  onKeyUp,
  onBlur,
}: SearchFieldProps) => {
  const [newValue, setNewValue] = useState<string | number | undefined>(value);

  const setSelectValue = function (e: any) {
    onChange?.(e);
    setNewValue(e.target.value ?? undefined);
  };

  useEffect(() => {
    setNewValue(value);
  }, [value]);

  return (
    <div className={`${fieldWrapper} ${className || ""}`} style={{ ...sx, width }}>
      <div className="relative">
        <input
          type="text"
          name={name}
          placeholder="Search"
          value={newValue ?? ""}
          onChange={(e: any) => setSelectValue(e)}
          onKeyUp={(e: any) => onKeyUp?.(e)}
          onBlur={(e: any) => setSelectValue(e)}
          className={`${inputBase} h-11 pr-10`}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
          <MdSearch size={18} />
        </span>
      </div>
    </div>
  );
};

export default SearchField;
