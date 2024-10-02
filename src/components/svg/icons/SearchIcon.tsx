import React from "react";

export default function SearchIcon(props?: any) {

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
      viewBox="0 0 20 20"
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.7337 18.4481L13.5351 12.2495C14.5476 10.9613 15.1522 9.338 15.1522 7.57612C15.1522 3.39861 11.7536 0 7.57607 0C3.39861 0 0 3.39861 0 7.57606C0 11.7535 3.39861 15.1521 7.57607 15.1521C9.33789 15.1521 10.9612 14.5476 12.2495 
        13.5351L18.4482 19.7337C18.6256 19.9113 18.8583 20 19.0909 20C19.3236 20 19.5563 19.9113 19.7337 19.7337C20.0888 19.3787 20.0888 18.8031 19.7337 18.4481ZM1.81818 7.57606C1.81818 4.40115 4.40116 1.81818 7.57607 1.81818C10.751 
        1.81818 13.334 4.40115 13.334 7.57606C13.334 10.751 10.751 13.3339 7.57607 13.3339C4.40116 13.3339 1.81818 10.751 1.81818 7.57606Z" fill={filteredStyles.fill || "#3B4559"}
      />
    </svg>
  )
}
