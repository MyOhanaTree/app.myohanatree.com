import React from "react";

export default function UsersIcon(props?: any) {

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
      viewBox="0 0 48 48"
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m38 3h-28c-2.2 0-4 1.8-4 4v28c0 2.2 1.8 4 4 4h8l6 6 6-6h8c2.2 0 4-1.8 4-4v-28c0-2.2-1.8-4-4-4zm-14 6.6c3 0 5.4 2.4 5.4 5.4s-2.4 5.4-5.4 5.4-5.4-2.4-5.4-5.4 2.4-5.4 5.4-5.4zm12 21.4h-24v-1.8c0-4 8-6.2 12-6.2s12 2.2 12 6.2z" fill={filteredStyles.fill || "#3B4559"} />
    </svg>
  )
}