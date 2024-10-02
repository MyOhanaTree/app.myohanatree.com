import styled from "styled-components";

interface CustomProps {
  $submitting?: boolean;
  $customStyles?: any;
}

export const InputWrap = styled.div<CustomProps>`
  display: flex;
  flex-direction: column;
  position:relative;    
  width: ${props => props?.$customStyles?.$width || "250px"};
  max-width: ${props => props?.$customStyles?.$width || "250px"};
  min-width: 175px; 
  max-width: 100%;
  ${(props) => props.$customStyles}
  input{    
    height: 44px;
    min-height:44px;
    border-radius: 5px;
    padding-left: 40px;
    padding-right: 10px;   
    width: 100%;
    border: 1px solid ${props => props.theme.colors.base_300};
    color: ${props => props.theme.colors.body};
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