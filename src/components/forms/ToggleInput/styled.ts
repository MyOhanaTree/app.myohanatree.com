import styled from "styled-components";
import { themevals as theme } from "@/theme/themevals";
import { Box } from "theme-ui";

interface CustomProps {
  $submitting?: boolean;
  $errors?: any;
}

export const ToggleWrapper = styled.div`
  display: inline-flex;
  background-color: ${theme.colors.base_100};
  border: 1px solid ${theme.colors.base_300};    
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  width: auto;
`;

export const LabelTrue = styled.div<{ $active?: boolean }>`
  padding: 5px 15px;
  flex-grow: 1;
  text-align: center;
  background-color: ${props => props.$active ? theme.colors.primary : ""};
  color: ${props => props.$active ? theme.colors.base_100 : ""};
`;

export const LabelFalse = styled.div<{ $active?: boolean }>`
  padding: 5px 15px;
  flex-grow: 1;
  text-align: center;
  background-color: ${props => props.$active ? theme.colors.primary : ""};
  color: ${props => props.$active ? theme.colors.base_100 : ""};
`;

export const LabelWrapper =  styled.div`
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  small {
    font-style: italic; font-size: .75rem; color: ${theme.colors.base_600};
  }
`;

export const InputWrap = styled(Box)<CustomProps>`
  && { margin-bottom: 20px; }
  position:relative;  
`;

export const Error = styled.div` 
  color:${theme.colors.danger};
  margin-top:2px;  
  font-size:14px;
`