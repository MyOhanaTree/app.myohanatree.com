import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ModalWrapper, ModalBackground, ModalInner, ModalBox, ModalHeader as ModalHeaderSt, ModalTitle, ModalClose, ModalFooter as ModalFooterSt, ModalBody as ModalBodySt } from "./styled";

export const Modal = ({children, isOpen, toggle, size, centered, customStyles} : { children: React.ReactNode; isOpen?: boolean, toggle?: () => void, size?: "sm" | "lg", centered?: boolean, customStyles?: any}) => {
  
  const handleToggle = () => {
    if(isOpen) document.body.style.overflow = "hidden";
    if(!isOpen) document.body.style.overflow = "";
    if (toggle) toggle();    
  };

  useEffect(() => {
    if(isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if(!isOpen) return null;

  return (
    createPortal(
      <ModalWrapper $customStyles={customStyles} className="modalWrapper">
        <ModalBackground onClick={handleToggle} className="modalBackground" />
        <ModalInner $size={size} $centered={centered} className="modalInner">
          <ModalBox className="modalBox">
            {children}
          </ModalBox>
        </ModalInner>
      </ModalWrapper>
    , document.body)
  );
};


export const ModalHeader = ({children, toggle, sx } : { children?: React.ReactNode; toggle?: () => void, sx?: any }) => {

  const handleToggle = () => {
    document.body.style.overflow = "hidden";    
    if (toggle) toggle();    
  };

  return (
    <ModalHeaderSt className="modalHeader" sx={sx}>
      <ModalTitle>{children}</ModalTitle>
      <ModalClose type="button" onClick={handleToggle} />
    </ModalHeaderSt>
  );
}

export const ModalBody = ({ children, sx } : { children: React.ReactNode, sx?: any }) => {

  return (
    <ModalBodySt className="modalBody" sx={sx}>
      {children}
    </ModalBodySt>
  );
}

export const ModalFooter = ({ children, sx } : { children?: React.ReactNode, sx?: any }) => {

  return (
    <ModalFooterSt className="modalFooter" sx={sx}>
      {children}
    </ModalFooterSt>
  );
}