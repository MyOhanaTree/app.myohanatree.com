import styled from "styled-components";
import { themevals } from "@/theme/themevals";

interface CustomProps {
  $submitting?: boolean;
  $customStyles?: any;
  $errors?: any;
}

export const InputWrap = styled.div<CustomProps>`
  display: flex;
  flex-direction: column;
  position:relative;
  margin-bottom: 20px;  
  ${(props) => props.$customStyles}
`;

export const LabelWrapper =  styled.div`
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  small {
    font-style: italic; font-size: .75rem; color: ${themevals.colors.base_600};
  }
`;

export const DropArea = styled.div` 
  border: 2px dashed ${themevals.colors.blue};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

export const DropAreaLabel = styled.div`
  font-weight: 600;
  color:${themevals.colors.blue};
`;

export const Error = styled.div` 
  color:${themevals.colors.danger};
  margin-top:2px; 
  font-size:14px;
`