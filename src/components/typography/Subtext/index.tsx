import React from "react";
import { StyledSubtext } from "./styled";

const Subtext = (props?: any) =>{
  return (
    <StyledSubtext $customStyles={{...props}}>{props.children}</StyledSubtext>
  )
}

export default Subtext;