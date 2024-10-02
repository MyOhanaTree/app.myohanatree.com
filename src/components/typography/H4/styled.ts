import styled from "styled-components";

interface CustomProps {
  $customStyles?: React.CSSProperties;
}

export const StyledH4 = styled.h4<CustomProps>`
    color:${({$customStyles}) => $customStyles?.color};
    text-align:${({$customStyles}) => $customStyles?.textAlign};
    margin-top:${({$customStyles}) => $customStyles?.marginTop};
    margin-bottom:${({$customStyles}) => $customStyles?.marginBottom};
    font-weight:${({$customStyles}) => $customStyles?.fontWeight || 500};
    font-size:${({$customStyles}) => $customStyles?.fontSize};
    text-transform: ${({$customStyles}) => $customStyles?.textTransform};    
`