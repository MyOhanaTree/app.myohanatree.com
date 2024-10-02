import React from "react";
import { StyledH4 } from "./styled";

const H4 = (props?: any) =>{
  return (
    <StyledH4 $customStyles={{...props}}>{props.children}</StyledH4>
  )
}

export default H4;