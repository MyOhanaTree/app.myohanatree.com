import styled from "styled-components";

interface CustomProps {
  $customStyles?: React.CSSProperties;
}

export const StyledSpan = styled.span<CustomProps>`
  color:${({$customStyles}) => $customStyles?.color};
  background-color:${({$customStyles}) => $customStyles?.backgroundColor};
  border-radius: ${({$customStyles}) => $customStyles?.borderRadius};
  border-color: ${({$customStyles}) => $customStyles?.borderColor};
  border-width: ${({$customStyles}) => $customStyles?.borderWidth};
  border-style: ${({$customStyles}) => $customStyles?.borderStyle};
  display:${({$customStyles}) => $customStyles?.display};
  text-align:${({$customStyles}) => $customStyles?.textAlign};
  font-weight:${({$customStyles}) => $customStyles?.fontWeight};
  font-size:${({$customStyles}) => $customStyles?.fontSize};
  margin-top:${({$customStyles}) => $customStyles?.marginTop};
  margin-right:${({$customStyles}) => $customStyles?.marginRight};
  margin-bottom:${({$customStyles}) => $customStyles?.marginBottom};
  margin-left:${({$customStyles}) => $customStyles?.marginLeft};
  padding-top:${({$customStyles}) => $customStyles?.paddingTop};
  padding-right:${({$customStyles}) => $customStyles?.paddingRight};
  padding-bottom:${({$customStyles}) => $customStyles?.paddingBottom};
  padding-left:${({$customStyles}) => $customStyles?.paddingLeft};
  text-transform: ${({$customStyles}) => $customStyles?.textTransform};
  white-space: ${({$customStyles}) => $customStyles?.whiteSpace};
`