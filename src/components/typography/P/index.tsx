import React from "react";
import { StyledP } from "./styled";

const P = (props?: any) =>{
  return (
    <StyledP $customStyles={{...props}}>{props.children}</StyledP>
  )
}

export default P;