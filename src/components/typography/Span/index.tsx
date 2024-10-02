import React from "react";
import { StyledSpan } from "./styled";

const Span = (props?: any) =>{
  return (
    <StyledSpan $customStyles={{...props}}>{props.children}</StyledSpan>
  )
}

export default Span;