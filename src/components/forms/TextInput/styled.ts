import styled from "styled-components";
import { themevals } from "@/theme/themevals";
import { Box } from "theme-ui";

interface CustomProps {
  $submitting?: boolean;
  $errors?: any;
}

export const inputStyles = {  
  borderRadius: 5,  
  paddingLeft: 10,
  paddingRight: 10,
  minHeight:44,
};

export const InputWrap = styled(Box)<CustomProps>`
  && {margin-bottom: 20px;}
  
  display: flex;
  flex-direction: column;
  position:relative;
  input{
    height: 44px;
    min-width: 175px;
    max-width: 100%;
    background-color: #fff;
    border: 1px solid ${(props) => props.$errors ? themevals.colors.danger + "!important" : themevals.colors.base_300};
    color: ${themevals.colors.body};
    ${inputStyles}
  }
  textarea {    
    height: 100px;
    min-width: 175px;    
    max-width: 100%;
    background-color: #fff;
    border: 1px solid ${(props) => props.$errors ? themevals.colors.danger + "!important" : themevals.colors.base_300};
    color: ${themevals.colors.body};
    ${inputStyles}
  }
  select{
    height: 44px;
    min-width: 175px;
    max-width: 100%;
    background-color: #fff;
    border: 1px solid ${(props) => props.$errors ? themevals.colors.danger + "!important" : themevals.colors.base_300};
    color: ${themevals.colors.body};
    ${inputStyles}
  }
`;

export const LabelWrapper =  styled.div`
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  small {
    font-style: italic; font-size: .75rem; color: ${themevals.colors.base_600};
  }
`;

export const Error = styled.div` 
  color:${themevals.colors.danger};
  margin-top:2px; 
  font-size:14px;
`