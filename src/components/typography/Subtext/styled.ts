import styled from "styled-components";

interface CustomProps {
  $customStyles?: React.CSSProperties;
}

export const StyledSubtext = styled.p<CustomProps>`
  font-size:.75rem;
  color:${({$customStyles}) => $customStyles?.color};
  text-align:${({$customStyles}) => $customStyles?.textAlign};
`