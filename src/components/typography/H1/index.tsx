import React from "react";
import { StyledH1 } from "./styled";

const H1 = (props?: any) =>{
  return (
    <StyledH1 $customStyles={{...props}}>{props.children}</StyledH1>
  )
}

export default H1;