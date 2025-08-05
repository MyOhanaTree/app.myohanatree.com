import React, { useEffect, useRef, useState } from "react";
import { ToastWrapper, ToastDiv, ToastText, CloseButton, CloseButtonWrap } from "./styled";
import { CloseIcon } from "@/components/svg";

const Toast = ({ children, remove, color }: any) =>{

  const removeRef = useRef<any>(null);
  removeRef.current = remove;

  const [appear, setAppear] = useState(false);

  useEffect(() => {

    const duration = 6000;
    const id = setTimeout(() => removeRef.current(), duration);

    setTimeout(function(){ makeAppear(); }, 100);
    setTimeout(function(){ makeGone(); }, 5000);

    return () => clearTimeout(id);
  }, []);

  const makeAppear = () =>{
    setAppear(true)
  }

  const makeGone = () =>{
    setAppear(false)
  }

  

  return (
    <ToastWrapper className={appear ? "fade_in" : "fade_out"}>
      <ToastDiv style={{background:color}}>
        <ToastText>
          { children }
        </ToastText>
        <CloseButtonWrap>
          <CloseButton onClick={remove}>
            <CloseIcon height={16} width={16} fill={"#ffffff"}/>
          </CloseButton>
        </CloseButtonWrap>
      </ToastDiv>
    </ToastWrapper>
  );
}

export default Toast;