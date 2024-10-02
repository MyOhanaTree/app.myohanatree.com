import React, { useEffect, useState } from "react";
import { Label, Input, FormGroup } from "reactstrap";
import { CheckboxWrapper } from "./styled";
import { useThemeUI } from "theme-ui";

const Checkbox = ({ 
  name, 
  label,
  value, 
  checked, 
  onChange 
}: {
  name?: string;
  label?: string | React.ReactNode;  
  value?: string | number;  
  checked?: boolean;
  className?: string;
  onChange?: (e?: any) => void;
}) => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [newChecked,setNewChecked] = useState<boolean>(checked || false);

  const setSelectValue = function (e: any){            
    if(typeof onChange === "function"){
      onChange(!newChecked)
    }
  }

  useEffect(() => {
    setNewChecked(checked || false)
  },[checked])

  return (
    <CheckboxWrapper theme={theme}>
      <FormGroup check inline>
        <Input name={name} value={value ?? 1} type="checkbox" component="input" checked={newChecked} onChange={setSelectValue} />
        <Label check>{label}</Label>
      </FormGroup>
    </CheckboxWrapper>
  );
};
export default Checkbox;
