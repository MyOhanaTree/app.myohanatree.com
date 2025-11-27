import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import { MdClose, MdChevronRight } from "react-icons/md";
import { fieldWrapper, labelWrapper, errorText, helperText, buildSelectStyles } from "../shared";

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
  sx?: React.CSSProperties;
  $responseErrors?: any;
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
  sx,
  $responseErrors,
  $errors,
  onChange,
}: SelectInputProps) => {
  const selectRef = useRef<any>(null);
  const [borderError, setBorderError] = useState<boolean>(false);

  const setSelectValue = function (e: any) {
    if (disabled) return true;

    let changedValue = e?.value ?? "";
    if (multiple) {
      const values = e.map((el: any) => el.value).filter((v: any) => v !== "");
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
    setBorderError(!!($responseErrors || $errors));
  }, [$responseErrors, $errors]);

  const MultiValueRemove = (props: any) => (
    <components.MultiValueRemove {...props}>
      <MdClose fontSize={"12px"} className="text-slate-500" />
    </components.MultiValueRemove>
  );

  const ClearIndicator = (props: any) => (
    <components.ClearIndicator {...props}>
      <MdClose fontSize={"12px"} className="text-slate-500" />
    </components.ClearIndicator>
  );

  const DropdownIndicator = (props: any) => (
    <components.DropdownIndicator {...props}>
      <MdChevronRight fontSize={"12px"} className="text-slate-500" />
    </components.DropdownIndicator>
  );

  const selectedValue = options?.filter((option) =>
    Array.isArray(value) ? (value as (string | number)[]).includes(option.value) : option.value === value
  );

  return (
    <div className={fieldWrapper} style={sx}>
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
