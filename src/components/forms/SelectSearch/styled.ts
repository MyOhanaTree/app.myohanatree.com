import styled from "styled-components";
import { Box } from "theme-ui";
import { themevals as theme } from "@/theme/themevals";

interface CustomProps {
  $submitting?: boolean;
  $errors?: any;
}

export const colorCodedStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderRadius: 6,    
    paddingLeft: 5,    
    minHeight:36,
    maxWidth: "100%",
    fontSize: "14px",
    boxShadow: "none",
    "&.react-select__control--menu-is-open" : {
      "& .react-select__single-value" : {opacity: .5}
    }         
  }),
  option: (baseStyles: any, state: any) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? state.data.color : state.isFocused ? `${state.data.color}33` : null,
    color: state.isSelected ? "white" : state.data.color,
    cursor: "pointer",
  }),
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    marginTop: 5,   
    backgroundColor: "#fff",
  }),
  singleValue: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: state.data.color,
    backgroundColor: `${state.data.color}10`,
  }),
  menuPortal: (baseStyles: any, state: any) => ({ ...baseStyles, zIndex: 9999 }),
  multiValue: (baseStyles: any, state: any) => ({
    ...baseStyles,
    backgroundColor: `${state.data.color}25 !important`,
    borderColor: state.data.color,
    borderStyle: "solid",
    borderWidth: "1px",
    color: state.data.color,
    borderRadius:"50px",
    overflow: "hidden",
    alignItems:"stretch",
    paddingLeft: "5px",
    paddingRight: "5px",
  }),
  multiValueLabel: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: state.data.color,
    borderRadius:"0px",
  }),
  multiValueRemove: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: state.data.color,
    borderRadius:"0px",
    ":hover": {
      cursor: "pointer",
    },
  }),
};

export const SelectStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderRadius: 6,    
    paddingLeft: 5,    
    minHeight:36,
    maxWidth: "100%",
    fontSize: "14px",
    boxShadow: "none",
    "&.react-select__control--menu-is-open" : {
      "& .react-select__single-value" : {opacity: .5}
    }         
  }),
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    marginTop: 5,   
    backgroundColor: "#fff",
  }),
  menuPortal: (baseStyles: any, state: any) => ({ ...baseStyles, zIndex: 9999 }),
  option: (styles: any, state: any) => ({
    ...styles, 
    backgroundColor: state.isSelected ? theme.colors.base_300 : "", 
    color: theme.colors.body, 
    "&:hover, &.react-select__option--is-focused": {
      ...styles,  
      backgroundColor : state.isSelected ? theme.colors.base_400 : theme.colors.base_200,
      color: theme.colors.base_800, 
      "&:active": {
        backgroundColor:"#EBEBEB"
      }
    },
  }),
  clearIndicator: (styles: any, { data }: any) => ({
    ...styles,
    paddingRight: 10,    
  }),
  singleValueRemove: (styles: any, { data }: any) => ({
    ...styles,
    padding: 10,  
  })
};

export const InputWrap = styled(Box)<CustomProps>`
  && {margin-bottom: 20px;}

  display: flex;
  flex-direction: column;
  position:relative;  
  max-width: 100%;
   .react-select__menu{
    .react-select__option{
      &:active{
        background-color: #EBEBEB;
      }
    }
  }
  .react-select__control { 
    & .react-select__input {
      border: 0!important;
    } 
      &.react-select__control--is-focused {
      border: 1px solid ${theme.colors.base_400}!important;
      box-shadow: none!important;
    }   
    & .react-select__multi-value {
      align-items: center;
      background-color: ${(props) => theme.colors.base_200};
    }      
    & .react-select__indicator:hover svg {
      cursor: pointer;
      fill: ${(props) => theme.colors.body};
      & path {
        fill: ${(props) => theme.colors.body};
      }
    }      
  }
`;

export const labelStyles = {
  marginBottom: 0,
  display: "flex",
  fontSize: 14,
  fontWeight: 500
};

export const LabelWrapper =  styled.div`
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  label {
    color: ${theme.colors.body};
    ${labelStyles}
  }
  small {
    font-style: italic; font-size: .75rem; color: ${theme.colors.base_600};
  }
`;

export const Error = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color:${theme.colors.danger};
  margin-top:2px;
  font-size:14px;
`