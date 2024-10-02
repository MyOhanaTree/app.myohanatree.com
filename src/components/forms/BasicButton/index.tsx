import React from "react";
import { Button } from "./styled";
import LoadingWheel from "components/ui/LoadingWheel";

const BasicButton = ({ 
  children, 
  scheme = "primary", 
  styles,
  type = "button", 
  outline = false,
  active,
  disabled,
  $submitting, 
  onClick 
}: {
  children: any;
  scheme?: "plain" | "clear" | "primary" | "secondary" | "danger" | "success" | "warning";
  styles?: {[key: string] : {[key: string] : string} | string };
  outline?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  active?: boolean;  
  disabled?: boolean;  
  $submitting?: boolean;
  onClick?: (val?: any) => void;
}) => {

  return (    
    <Button type={type || "button"} color={scheme} outline={outline} active={active} $styles={styles} $submitting={$submitting} disabled={disabled || $submitting} onClick={onClick}>
      {children}
      {$submitting && <LoadingWheel width="20px" stroke="2px" />}
    </Button>    
  );
};

export default BasicButton;
