import styled from "styled-components";
import { themevals } from "theme/themevals";

interface CustomProps {
  $customStyles?: any;
}

export const LoadingWheelWrap = styled.div<CustomProps>`
  display: flex;
  position: relative;
  width: 100%;
  align-items:center;
  justify-content:center;  
  margin: 2px;
  height:${({$customStyles}) => $customStyles?.width ? $customStyles.width : "40px"};
  width:${({$customStyles}) => $customStyles?.width ? $customStyles.width : "40px"};
  div{
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${({$customStyles}) => $customStyles?.width ? $customStyles.width : "40px"};
    height: ${({$customStyles}) => $customStyles?.width ? $customStyles.width : "40px"};
    margin: 5px;
    border: ${({$customStyles}) => $customStyles?.stroke ? $customStyles.stroke : "5px"} solid ${({$customStyles}) => $customStyles?.fill ? $customStyles.fill : themevals?.colors?.secondary};
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({$customStyles}) => $customStyles?.fill ? $customStyles.fill : themevals?.colors?.secondary} transparent transparent transparent;
  }
  div:nth-child(1) {
    animation-delay: -0.45s;
  }
   div:nth-child(2) {
    animation-delay: -0.3s;
  }
   div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`