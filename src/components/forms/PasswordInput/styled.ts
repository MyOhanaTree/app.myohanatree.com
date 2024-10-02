import styled from "styled-components";

interface CustomProps {
  $errors?: any;
  $customStyles?: any;
}

export const inputStyles = {
  height: 44,
  borderRadius: 5,
  paddingLeft: 10,
  paddingRight: 10,
  minHeight: 44,
};

export const InputWrap = styled.div<CustomProps>`
  display: flex;
  flex-direction: column;
  position:relative;
  margin-bottom: 30px;  
  input{
    min-width: 175px; 
    max-width: 100%;
    border: 1px solid ${(props) => props.$errors ? props.theme.colors.danger + "!important" : props.theme.colors.base_300};
    color: ${props => props.theme.colors.body};
    ${inputStyles}
  }
  ${(props) => props.$customStyles}
`;

export const labelStyles = {
  marginBottom: 0,
  display: "flex",
  fontSize: 14,
  fontWeight: 500
};

export const LabelWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  label {
    color: ${props => props.theme.colors.body};
    ${labelStyles}
  }
  small {
    font-style: italic; font-size: .75rem; color: ${(props) => props.theme.colors.ltgrey};
  }
`;



export const Error = styled.div` 
  color:${(props) => props.theme.colors.danger};
  margin-top:2px;  
  font-size:14px;
`

export const PasswordToggleWrap = styled.div`
  position: relative;
`;

export const VisibleWrap = styled.div`
  position:absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  right:10px;
  cursor:pointer;
`