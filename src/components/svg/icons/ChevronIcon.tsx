import React from "react";

export default function ChevronIcon(props?: any) {

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
      viewBox="0 0 58 102"
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M55.8765 12.4375C58.7078 9.59224 58.7078 4.97918 55.8765 2.13394C53.0452 -0.711313 48.4548 -0.711313 45.6235 2.13394L2.12348 45.8482C-0.707821 48.6935 -0.707822 
      53.3065 2.12348 56.1518L45.6235 99.8661C48.4548 102.711 53.0452 102.711 55.8765 99.8661C58.7078 97.0208 58.7078 92.4078 55.8765 89.5625L17.503 51L55.8765 12.4375Z"
      fill={filteredStyles.fill || "#3B4559"} />
    </svg>
  )
}