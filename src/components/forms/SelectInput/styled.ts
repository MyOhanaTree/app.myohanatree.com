import styled from "styled-components";
import { themevals } from "theme/themevals";

interface CustomProps {
  $submitting?: boolean;
  $customStyles?: any;
  $errors?: any;
}

export const SelectStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderRadius: 5,    
    paddingLeft: 10,    
    minHeight:44,            
  }),
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    marginTop: 2,   
    backgroundColor: "#fff", 
  }),
  menuPortal: (baseStyles: any, state: any) => ({
    ...baseStyles,
    zIndex: 9999, // Set the z-index for the menu portal
  }),
  option: (styles: any, state: any) => ({
    ...styles, 
    backgroundColor: state.isSelected ? themevals.colors.base_300 : "", 
    color: themevals.colors.body, 
    "&:hover, &.react-select__option--is-focused": {
      ...styles,  
      backgroundColor : state.isSelected ? themevals.colors.base_300 : themevals.colors.base_200,
      color: themevals.colors.body, 
    },
  }),
  multiValueRemove: (styles: any, { data }: any) => ({
    ...styles,
    padding: 10,    
  }),
};

export const InputWrap = styled.div<CustomProps>`
  display: flex;
  flex-direction: column;
  position:relative;  
  margin-bottom: 20px;
  max-width: 100%;
  .react-select__control { 
    max-width: 100%;
    background-color: #fff;
    border: 1px solid ${(props) => props.$errors ? themevals.colors.danger : themevals.colors.base_300}!important;
    box-shadow: none!important;
    text-align: left;
    color: ${themevals.colors.body};  
    & .react-select__value-container {
      flex-wrap: ${props => props?.$customStyles?.optionNoWrap ? "nowrap" : "wrap"};
    }      
    & .react-select__multi-value {
      align-items: center;
      background-color: ${themevals.colors.base_200};
    }
    & .react-select__indicator {
      padding: 13px 15px;      
    }  
    & .react-select__indicator:hover svg {
      cursor: pointer;
      fill: ${themevals.colors.body};
      & path {
        fill: ${themevals.colors.body};
      }
    }      
  }
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

export const Error = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color:${themevals.colors.danger};
  margin-top:2px;
  font-size:14px;
`