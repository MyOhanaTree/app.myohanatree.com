import React from "react";

export default function LogoutIcon(props?: any) {

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
      viewBox="0 0 512 512"
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m256 0c141.385 0 256 114.615 256 256s-114.615 256-256 256-256-114.615-256-256 114.615-256 256-256zm-149.995 256a18.75 18.75 0 0 0 5.5 13.266l80.618 80.618a18.741 18.741 0 0 0 
      26.5-26.5l-48.614-48.643h155.851a18.737 18.737 0 0 0 0-37.474h-155.849l48.614-48.614a18.751 18.751 0 1 0 -26.5-26.533l-80.625 80.614a18.848 18.848 0 0 0 -5.5 13.266zm281.253-84.359a18.739 
      18.739 0 0 0 -18.737 18.737v131.244a18.737 18.737 0 0 0 37.474 0v-131.244a18.738 18.738 0 0 0 -18.737-18.737z" fill={filteredStyles.fill || "#3B4559"} fillRule="evenodd"/>
    </svg>
  )
}