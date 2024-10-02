import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import BasicButton from "components/forms/BasicButton";

const BasicModal = ({children, title, confirm_click, cancel_click, confirm_text = "Yes", cancel_text = "No", submitting,  size = "lg", centered = true, bodyStyles }: any) => {
  
  return (
    <Modal isOpen={true} toggle={cancel_click} size={size} centered={centered}>
      {title &&            
        <ModalHeader toggle={cancel_click}>{title}</ModalHeader>
      }
      {children &&
        <ModalBody style={bodyStyles}>{children}</ModalBody>
      }
      <ModalFooter>
        {typeof cancel_click === "function" &&
          <BasicButton 
            type="button" 
            outline={true}               
            onClick={cancel_click} 
          >{cancel_text}</BasicButton>
        }
        {typeof confirm_click === "function" &&
          <BasicButton
            type="button"          
            onClick={confirm_click} 
            $submitting={submitting}
          >{confirm_text}</BasicButton>   
        }             
      </ModalFooter>
    </Modal>
  );
};

export default BasicModal;
