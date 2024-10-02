import styled from "styled-components";

interface CustomProps {
  $styles?: any;
}

export const Div = styled.div<CustomProps>`    
  ${(props) => props.$styles}
`;