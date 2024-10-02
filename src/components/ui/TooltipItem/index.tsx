import React, { useRef, useState } from 'react';
import { Tooltip } from 'reactstrap';
import { TooltipWrap } from './styled';

interface TooltipItemProps {
  children?: React.ReactNode;
  id?: string;
  placement?: 'top' | 'bottom';
  content?: React.ReactNode;
}

export default function TooltipItem({
  children,
  id,
  placement = 'top',
  content
}: TooltipItemProps) {
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const randomId = useRef<string>(`Tooltip-${Math.random().toString(36).slice(2, 14)}${id}`);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <TooltipWrap id={randomId.current}>
        {children}
      </TooltipWrap>
      <Tooltip
        placement={placement}
        isOpen={tooltipOpen}
        target={randomId.current}
        toggle={toggle}
      >
        {content}
      </Tooltip>
    </>
  );
}
