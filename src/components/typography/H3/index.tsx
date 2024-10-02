import React from "react";
import { StyledH3 } from "./styled";

const H3 = (props?: any) =>{
  return (
    <StyledH3 $customStyles={{...props}}>{props.children}</StyledH3>
  )
}

export default H3;