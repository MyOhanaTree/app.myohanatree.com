import styled from "styled-components";
import { Box } from "theme-ui";
import { themevals } from "@/theme/themevals";

interface CustomProps {
  $size?: "sm" | "lg";
  $centered?: boolean;
}

export const ModalWrapper = styled(Box)<CustomProps>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1042;
  width: 100%;
  height: 100%;  
  padding: 1rem;
`;

export const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;  
  background-color: rgba(0,0,0,0.5);
`;

export const ModalInner = styled.div<CustomProps>`
  position: absolute;  
  z-index: 2;      
  border-radius: 0.5rem;
  width: 600px;
  ${(props) => props.$centered && "top: 50%; left: 50%; transform: translate(-50%, -50%);"}  
  ${(props) => !props.$centered && "left: 50%; transform: translate(-50%, 0%);"}  
  ${(props) => props.$size === "sm" && "width: 300px;"}
  ${(props) => props.$size === "lg" && "width: 1100px;"}
  max-width: 90%;
  max-height: calc(100% - 3rem); 
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;  
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid ${themevals.colors.base_300};
  border-radius: 6px;
  box-shadow: 0px 4px 12px 0px rgba(113, 125, 150, 0.05);  
  min-height: 0px;
  max-height: 100%;
  flex: 1 1 auto;

  & > form {
    display: flex;
    flex-direction: column;
    min-height: 0px;
    max-height: 100%;
    flex: 1 1 auto;
  }
`;

export const ModalBody = styled(Box)<CustomProps>`
  flex-grow: 1;    
  padding: 1.5rem;  
  overflow-y: auto;
`;

export const ModalHeader = styled(Box)<CustomProps>`
  padding: 1rem;
  border: none;
  border-radius: calc(0.35rem - 1px) calc(0.35rem - 1px) 0 0;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 0;
`;

export const ModalTitle = styled.h3`
  font-$size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: ${themevals.colors.base_800};
`;


export const ModalFooter = styled(Box)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding: 1rem;
  border: none;
  border-radius: 0 0 calc(0.35rem - 1px) calc(0.35rem - 1px);
  border-top: 1px solid #dee2e6;
`;

export const ModalClose = styled.button`
  
  padding: .5rem;
  margin: 0 0 0 auto;
  cursor: pointer;    

  box-sizing: content-box;
  width: .5rem;
  height: .5rem;
  padding: .25em .25em;
  color: #000;
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
  background-$size: cover;
  background-repeat: no-repeat;
  border: 0;
  border-radius: .375rem;
  opacity: 1;

  &:hover {
    opacity: 0.75;
  }

  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    opacity: 1;
  }

  &:disabled {
    opacity: 0.25;
  }
`;