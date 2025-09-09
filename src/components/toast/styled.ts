import styled from "styled-components";

export const ToastWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 50%;
    min-width: 380px;
    max-width: 95%;
    z-index: 999999;
    transform:translateX(-50%);
`
export const ToastDiv = styled.div`
    border: 2px solid transparent;
    border-radius: 4px;    
    width: 100%;
    max-width: 480px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, .2);
    margin-top: 1rem;
    display: flex;
    position: relative;
    cursor: pointer;    
`
export const ToastText = styled.div`
    padding: 10px 24px;
    line-height: 1.25rem;
    height:auto;
    color:white;
    font-weight:500;        
`
export const CloseButtonWrap = styled.div`
    margin-left: auto;
    display:flex;
    align-items:center;
`
export const CloseButton = styled.div`
    border: none;
    background-color: transparent;
    font-size: 1rem;
    margin-right: 15px;
    cursor: pointer; 
    line-height:1;
    > div{
        display:flex;
        align-items:center;
        > div{
            display:flex;
            align-items:center;
        }
    } 
`
