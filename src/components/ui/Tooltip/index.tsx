import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TooltipWrap, TooltipPop } from './styled';

interface TooltipProps {
  children?: React.ReactNode;
  id?: string;
  placement?: 'top' | 'bottom';
  content?: React.ReactNode;
}

export default function TooltipItem({
  children,
  placement = 'top',
  content,
}: TooltipProps) {

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const style: React.CSSProperties = {};
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (placement === 'top') {
      // Adjust top based on the scroll position
      style.top = triggerRect.top + scrollY - tooltipRect.height - 8; // 8px offset
      style.left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    } else {
      // Adjust top based on the scroll position
      style.top = triggerRect.bottom + scrollY + 8; // 8px offset
      style.left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    }

    setTooltipStyle(style);
  };

  useEffect(() => {    
    if (isVisible && triggerRef.current) {
      calculatePosition();
    }
  }, [isVisible, triggerRef.current]);

  return (
    <>
      <TooltipWrap
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </TooltipWrap>

      {isVisible && content &&
        ReactDOM.createPortal(
          <TooltipPop
            ref={tooltipRef}            
            onClick={() => setIsVisible(!isVisible)}
            $customStyle={{ ...tooltipStyle }}
          >
            {content}
          </TooltipPop>,
          document.body
        )}
    </>
  );
}
