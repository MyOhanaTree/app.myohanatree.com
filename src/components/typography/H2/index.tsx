import React from "react";
import { StyledH2 } from "./styled";

const H2 = (props?: any) =>{
  return (
    <StyledH2 $customStyles={{...props}}>{props.children}</StyledH2>
  )
}

export default H2;