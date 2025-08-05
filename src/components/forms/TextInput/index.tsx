import React, { useState, useEffect } from "react";
import { InputWrap, LabelWrapper, Error } from "./styled";
import { Input, Label } from "theme-ui";

const TextInput = ({
  name,
  label,
  value,
  description,
  type,
  autoComplete,
  required,
  disabled,
  readonly,
  placeholder,
  min,
  max,
  step,
  sx,
  $errors,
  $responseErrors,
  onChange
}:{
  name?: string;
  label?: string | React.ReactNode;
  value?: string | number;
  description?: string;
  type?: any;
  autoComplete?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  sx?: any;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (e?: any) => void;
}) => {

  const [borderError, setBorderError] = useState(false);

  const setSelectValue = function (e: any){
    if(disabled) return true;

    let value = e.target.value;

    if(type === "number"){
      value = parseFloat(e.target.value)
      if(min && value < min){ value = min }
      if(max && value > max){ value = max }
    }

    if(typeof onChange === "function"){
      onChange(value)
    }
  }

  useEffect(() => {
    if($responseErrors || $errors){
      setBorderError(true);
    }else{
      setBorderError(false);
    }
  },[$responseErrors, $errors]);

  return (
    <InputWrap sx={sx} $errors={borderError}>
      {label &&
        <LabelWrapper>
          <Label>{label}</Label>
          {required ? <span>*</span>  : ''}
        </LabelWrapper>
      }
      <Input
        as={type === "textarea" ? "textarea" : "input"}
        type={type || "text"}
        name={name}
        disabled={disabled}
        readOnly={readonly}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        value={value ?? ""}
        onChange={(e: any) => setSelectValue(e)}
      />
      {description && <p><small>{description}</small></p>}
      {$errors && <Error>{$errors}</Error>}
    </InputWrap>
  );
};

export default TextInput;
