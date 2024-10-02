import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";

import { InputWrap, LabelWrapper, Error, VisibleWrap, PasswordToggleWrap } from "./styled";
import { useThemeUI } from "theme-ui";
import { EyeIcon, HiddenIcon } from "components/svg";


const PasswordInput = ({ 
  name, 
  label, 
  value,   
  required,
  description, 
  autoComplete,
  $customStyles, 
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
  $customStyles?: any;
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
    <InputWrap $errors={borderError} $customStyles={$customStyles} theme={theme}>               
      <LabelWrapper theme={theme}>
        <label>{label}</label>
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
          {!visible && <EyeIcon fill={theme?.colors?.base_400}  width={"20px"} height={"20px"} />}
          {visible && <HiddenIcon  fill={theme?.colors?.base_400}  width={"20px"} height={"20px"} />}          
        </VisibleWrap>   
      </PasswordToggleWrap> 
      {description && <p><small>{description}</small></p>}
      {$errors && <Error theme={theme}>{$errors}</Error>}          
    </InputWrap>
  );
};

export default PasswordInput;
