import styled from "styled-components";

interface CustomProps {
  $customStyle?: any;
}


export const TooltipPop = styled.div<CustomProps>`
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  z-index: 9999;  
  pointer-events: auto;
  transition: opacity 0.2s ease-in-out;
  position: absolute;    
  padding: 5px;
  border-radius: 6px;  
  font-size: 14px;
  width: 120px;
  ${(props) => props.$customStyle}
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #000 transparent transparent transparent;
  }
`;

export const TooltipWrap = styled.div`
  display: inline-block;
  position: relative;
  cursor: pointer;
`;
