import styled from "styled-components";

interface CustomProps {
  $customStyles?: React.CSSProperties;
}

export const StyledP = styled.p<CustomProps>`
  color:${({$customStyles}) => $customStyles?.color};
  text-align:${({$customStyles}) => $customStyles?.textAlign};
  font-weight:${({$customStyles}) => $customStyles?.fontWeight};
  font-size:${({$customStyles}) => $customStyles?.fontSize};
  margin-top:${({$customStyles}) => $customStyles?.marginTop};
  margin-bottom:${({$customStyles}) => $customStyles?.marginBottom};
  margin-right:${({$customStyles}) => $customStyles?.marginRight};  
  text-transform: ${({$customStyles}) => $customStyles?.textTransform};
`