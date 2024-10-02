import React, { useEffect, useState } from "react";
import { ToggleWrapper, LabelTrue, LabelFalse, InputWrap, Error, LabelWrapper } from "./styled";
import { useThemeUI } from "theme-ui";

export default function ToggleInput({ 
  label,
  description,
  labelTrue,
  labelFalse,
  required,
  checked, 
  $customStyles,
  $responseErrors,
  $errors,
  onChange 
}: {
  label?: string | React.ReactNode;
  description?: string;
  labelTrue?: string;
  labelFalse?: string;  
  required?: boolean;
  checked?: boolean;
  $customStyles?: any;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (e?: any) => void;
}) {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [borderError, setBorderError] = useState(false);
  const [newChecked,setNewChecked] = useState<boolean>(checked || false);

  const setSelectValue = function (e: any){            
    if(typeof onChange === "function"){
      onChange(!newChecked)
    }
  }

  useEffect(() => {
    setNewChecked(checked || false)
  },[checked]);

  useEffect(() => {
    if($responseErrors || $errors){
      setBorderError(true);
    }else{
      setBorderError(false);
    }
  },[$responseErrors, $errors]);

  return (
    <InputWrap theme={theme} $customStyles={$customStyles} $errors={borderError}>
      {label && 
        <LabelWrapper theme={theme}>
          <label>{label}</label>
          {required ? <span>*</span>  : ''}         
        </LabelWrapper>
      }      
      <ToggleWrapper theme={theme} onClick={setSelectValue}>      
        <LabelTrue $active={newChecked ? true : false}>{labelTrue || "ON"}</LabelTrue>      
        <LabelFalse $active={newChecked ? false : true}>{labelFalse || "OFF"}</LabelFalse>      
      </ToggleWrapper>   
      {description && <p><small>{description}</small></p>}    
      {$errors && <Error theme={theme}>{$errors}</Error>}
    </InputWrap>
  );
}