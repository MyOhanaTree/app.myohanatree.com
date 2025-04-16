import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";

const BasicModal = ({children, title, actions, onCloseClick, size, centered = true, customStyles }: any) => {
  
  return (
    <Modal isOpen={true} toggle={onCloseClick} size={size} centered={centered} customStyles={customStyles}>
      <ModalHeader toggle={onCloseClick}>{title}</ModalHeader>      
      {children &&
        <ModalBody>{children}</ModalBody>
      }
      {actions &&
        <ModalFooter>
          {actions}             
        </ModalFooter>
      }
    </Modal>
  );
};

export default BasicModal;
