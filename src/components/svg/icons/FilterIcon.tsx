import React from "react";

export default function FilterIcon(props?: any) {

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
      viewBox="0 0 20 15"
      fill="none" 
      style={{...filteredStyles, fill : 'none'}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M3.22503 2.58333C3.65338 1.23238 4.90398 0.25 6.3834 0.25C7.86282 0.25 9.11342 1.23238 9.54178 2.58333H18.4834C19.0479 2.58333 19.5 3.04716 19.5 3.61104C19.5 4.17492 19.0479 4.63875 18.4834 4.63875H9.54178C9.1134 5.98972 7.86262 6.97208 6.3834 6.97208C4.90419 6.97208 3.6534 5.98972 3.22503 4.63875H1.0166C0.452068 4.63875 0 4.17492 0 3.61104C0 3.04716 0.452069 2.58333 1.0166 2.58333H3.22503ZM8.39333 10.3613C8.82171 9.01028 10.0725 8.02792 11.5517 8.02792C13.0309 8.02792 14.2817 9.01028 14.7101 10.3613H18.4834C19.0479 10.3613 19.5 10.8251 19.5 11.389C19.5 11.9528 19.0479 12.4167 18.4834 12.4167H14.7101C14.2817 13.7676 13.0309 14.75 11.5517 14.75C10.0725 14.75 8.82171 13.7676 8.39333 12.4167H1.0166C0.452069 12.4167 0 11.9528 0 11.389C0 10.8251 0.452068 10.3613 1.0166 10.3613H8.39333Z" fill={filteredStyles.fill || '#BABEC5'}/>
    </svg>
  )
}