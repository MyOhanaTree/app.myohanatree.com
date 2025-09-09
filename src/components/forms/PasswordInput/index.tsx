import React, { useState, useEffect } from "react";
import { InputWrap, LabelWrapper, Error, VisibleWrap, PasswordToggleWrap } from "./styled";
import { Input, Label, useThemeUI } from "theme-ui";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const PasswordInput = ({ 
  name, 
  label, 
  value,   
  required,
  description, 
  autoComplete,
  sx, 
  $errors, 
  $responseErrors, 
  onChange 
}: {
  name?: string;
  label?: string | React.ReactNode;
  value?: string;
  required?: boolean;
  description?: string;
  autoComplete?: string;
  sx?: any;
  $errors?: any;
  $responseErrors?: any;
  onChange?: (e: any) => void;
}) => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [borderError, setBorderError] = useState(false);
  const [visible, setVisible] = useState(false);

  const setSelectValue = function (e: any){            
    if(typeof onChange === "function"){
      onChange(e.target.value)
    }
  }

  useEffect(() => {
    if ($responseErrors || $errors) {
      setBorderError(true);
    } else {
      setBorderError(false);
    }
  }, [$responseErrors, $errors]);

  const showPassword = () => {
    setVisible(!visible);
  };

  return (
    <InputWrap $errors={borderError} sx={sx}>               
      <LabelWrapper>
        <Label>{label}</Label>
        {required ? <span>*</span>  : ''}         
      </LabelWrapper>
      <PasswordToggleWrap>
        <Input           
          type={!visible ? "password" : "text"} 
          name={name} 
          value={value} 
          onChange={setSelectValue} 
          autoComplete={autoComplete} 
        />
        <VisibleWrap onClick={showPassword}>
          {!visible && <IoMdEye color={String(theme?.colors?.base_400)} fontSize={"20px"} />}
          {visible && <IoMdEyeOff color={String(theme?.colors?.base_400)} fontSize={"20px"} />}          
        </VisibleWrap>   
      </PasswordToggleWrap> 
      {description && <p><small>{description}</small></p>}
      {$errors && <Error>{$errors}</Error>}          
    </InputWrap>
  );
};

export default PasswordInput;
