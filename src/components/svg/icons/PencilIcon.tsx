import React from "react";

export default function PencilIcon(props?: any) {

  const svgStyles: any = {
    width: props.width ? props.width : null,
    height: props.height ? props.height : null,
    fill: props.fill ? props.fill : null,
    margin: props.margin ? props.margin : null,
  };

  const filteredStyles = Object.keys(svgStyles)
  .filter(key => svgStyles[key] !== null && svgStyles[key] !== undefined)
  .reduce((acc: any, key) => {
    acc[key] = svgStyles[key];
    return acc;
  }, {});

  return (    
    <svg 
      viewBox="0 0 200 200" 
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M97.239 49.4258L0 146.664V199.998H53.3336L150.573 102.759L97.239 49.4258Z"fill={filteredStyles.fill || "#3B4559"}/>
      <path d="M116.094 30.5719L169.427 83.9052L188.954 64.3791C196.026 57.3065 199.999 47.7143 199.999 37.7124C199.999 16.8844 183.115 0 162.287 0C152.284 0 142.692 3.97327 135.62 11.0457L116.094 30.5719Z" fill={filteredStyles.fill || "#3B4559"}/>
    </svg>
  )
}
