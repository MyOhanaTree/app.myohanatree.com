import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import { InputWrap, SelectStyles, LabelWrapper, Error } from "./styled";
import { Label, useThemeUI } from "theme-ui";
import { MdClose, MdChevronRight } from "react-icons/md";


const SelectInput = ({
  name,
  label,
  options,
  value,
  description,
  placeholder,
  multiple,
  readonly,
  required,
  disabled,
  clearable,
  sx,
  $responseErrors,
  $errors,
  onChange,
}: {
  name?: string;
  label?: string | React.ReactNode;
  options?: { value: string | number; label?: string }[];
  value?: string | number | string[] | number[];
  description?: string;
  placeholder?: React.ReactNode;
  required?: boolean;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  sx?: any;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (e?: any) => void;
}) => {
  const selectRef = useRef<any>(null);
  const themeContext = useThemeUI();
  const { theme } = themeContext;
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
    if ($responseErrors || $errors) {
      setBorderError(true);
    } else {
      setBorderError(false);
    }
  }, [$responseErrors, $errors]);

  const MultiValueRemove = (props: any) => {
    return (
      <components.MultiValueRemove {...props}>
        <MdClose fontSize={"12px"} color={String(theme?.colors?.base_500)} />
      </components.MultiValueRemove>
    );
  };

  const ClearIndicator = (props: any) => {
    return (
      <components.ClearIndicator {...props}>
        <MdClose fontSize={"12px"} color={String(theme?.colors?.base_500)} />
      </components.ClearIndicator>
    );
  };

  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <MdChevronRight fontSize={"12px"} color={String(theme?.colors?.base_500)} />
      </components.DropdownIndicator>
    );
  };

  return (
    <InputWrap sx={sx} $errors={borderError} theme={theme}>
      {label && (
        <LabelWrapper theme={theme}>
          <Label>{label}</Label>
          {required ? <span>*</span> : ""}
        </LabelWrapper>
      )}
      <Select
        ref={selectRef}
        styles={SelectStyles}
        menuPlacement="auto"
        classNamePrefix="react-select"
        options={options}
        name={name}
        placeholder={placeholder || "Select..."}
        isMulti={multiple}
        value={options?.filter((option) => Array.isArray(value) ? (value as (string | number)[]).includes(option.value) : option.value === value)}
        onChange={(e) => setSelectValue(e)}
        components={{ MultiValueRemove, ClearIndicator, DropdownIndicator }}
        isClearable={multiple || clearable}
        isDisabled={readonly}
        menuPortalTarget={document.body}
      />
      {description && (
        <p>
          <small>{description}</small>
        </p>
      )}
      {$errors && <Error theme={theme}>{$errors}</Error>}
    </InputWrap>
  );
};

export default SelectInput;
