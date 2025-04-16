import React from "react";
import { Button, ButtonProps, Spinner } from "theme-ui";

interface LoadingButtonProps extends ButtonProps {
  $loading?: boolean; 
}


const LoadingButton = (props: LoadingButtonProps) => { 
  const { $loading, children, ...rest }: any = props;  
  
  return <Button {...{...rest, sx : {...rest.sx, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px"}}}>
    {children} {$loading && <Spinner size={parseFloat((rest?.sx?.fontSize  || "20px").replace(/[^0-9.]/g, ''))} strokeWidth={2} />}
  </Button>    
};

export default LoadingButton;
