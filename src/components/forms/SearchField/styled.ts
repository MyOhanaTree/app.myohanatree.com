import styled from "styled-components";
import { themevals } from "@/theme/themevals";
import { Box } from "theme-ui";

interface CustomProps {
  $submitting?: boolean;
}

export const InputWrap = styled(Box)<CustomProps>`
  && {margin-bottom: 20px;}
  
  display: flex;
  flex-direction: column;
  position:relative;    
  min-width: 175px; 
  max-width: 100%;
  input{    
    height: 44px;
    min-height:44px;
    border-radius: 5px;
    padding-left: 40px;
    padding-right: 10px;   
    width: 100%;
    background-color: #fff;
    border: 1px solid ${themevals.colors.base_300};
    color: ${themevals.colors.body};
  }  
`;

export const InputInner = styled.div`
  position:relative;   
`;

export const SearchIconWrap = styled.div`
  position:absolute;
  top:50%;
  left:10px;
  transform:translateY(-50%);
`