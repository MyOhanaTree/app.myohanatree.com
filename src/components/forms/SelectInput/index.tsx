import React, { useState, useEffect, useRef } from "react";
import Select, { components, type InputActionMeta } from "react-select";
import { fieldWrapper, labelWrapper, errorText, helperText, buildSelectStyles } from "../shared";
import CloseIcon from "@/components/icons/Close";
import ChevronRightIcon from "@/components/icons/ChevronRight";

type OptionType = { value: string | number; label?: string };

type SelectInputProps = {
  name?: string;
  label?: string | React.ReactNode;
  options?: OptionType[];
  value?: string | number | string[] | number[];
  description?: string;
  placeholder?: React.ReactNode;
  required?: boolean;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  loading?: boolean;
  filterOption?: ((option: any, inputValue: string) => boolean) | null;
  noOptionsMessage?: (obj: { inputValue: string }) => React.ReactNode;
  onInputChange?: (inputValue: string, actionMeta: InputActionMeta) => void;
  sx?: React.CSSProperties;
  wrapperClassName?: string;
  $errors?: any;
  onChange?: (e?: any) => void;
};

const SelectInput = ({
  name,
  label,
  options,
  value,
  description,
  placeholder,
  multiple,
  required,
  readonly,
  disabled,
  clearable,
  loading,
  filterOption,
  noOptionsMessage,
  onInputChange,
  sx,
  wrapperClassName,
  $errors,
  onChange,
}: SelectInputProps) => {
  const selectRef = useRef<any>(null);
  const [borderError, setBorderError] = useState<boolean>(false);

  const setSelectValue = function (e: any) {
    if (disabled) return true;

    let changedValue = e?.value ?? "";
    if (multiple) {
      const values = (Array.isArray(e) ? e : []).map((el: any) => el.value).filter((v: any) => v !== "");
      changedValue = values;
    }

    if (typeof onChange === "function") {
      onChange(changedValue ?? "");
    }
    setTimeout(() => {
      selectRef?.current?.blur();
    }, 100);
  };

  useEffect(() => {
    setBorderError(!!$errors);
  }, [$errors]);

  const MultiValueRemove = (props: any) => (
    <components.MultiValueRemove {...props}>
      <CloseIcon className="h-3 w-3 text-slate-500" />
    </components.MultiValueRemove>
  );

  const ClearIndicator = (props: any) => (
    <components.ClearIndicator {...props}>
      <CloseIcon className="h-3 w-3 text-slate-500" />
    </components.ClearIndicator>
  );

  const DropdownIndicator = (props: any) => (
    <components.DropdownIndicator {...props}>
      <ChevronRightIcon className="h-3 w-3 text-slate-500" />
    </components.DropdownIndicator>
  );

  const selectedValue = options?.filter((option) =>
    Array.isArray(value) ? (value as (string | number)[]).includes(option.value) : option.value === value
  );

  return (
    <div className={`${fieldWrapper} ${wrapperClassName ?? ""}`.trim()} style={sx}>
      {label && (
        <div className={labelWrapper}>
          <span>{label}</span>
          {required ? <span className="text-rose-600">*</span> : ""}
        </div>
      )}
      <Select
        ref={selectRef}
        styles={buildSelectStyles(borderError)}
        menuPlacement="auto"
        classNamePrefix="react-select"
        options={options}
        name={name}
        placeholder={placeholder || "Select..."}
        isMulti={multiple}
        value={selectedValue}
        onChange={(e) => setSelectValue(e)}
        components={{ MultiValueRemove, ClearIndicator, DropdownIndicator }}
        isClearable={multiple || clearable}
        isDisabled={readonly || disabled}
        isLoading={loading}
        filterOption={filterOption}
        noOptionsMessage={noOptionsMessage}
        onInputChange={onInputChange}
        menuPortalTarget={document.body}
      />
      {description && (
        <p className={helperText}>
          <small>{description}</small>
        </p>
      )}
      {$errors && <div className={errorText}>{$errors}</div>}
    </div>
  );
};

export default SelectInput;
