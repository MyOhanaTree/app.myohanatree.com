import React from "react";


export default function BellIcon(props?: any) {
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
      fill="none" 
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="M193.499,459.298c5.237,30.54,31.518,52.702,62.49,52.702c30.98,0,57.269-22.162,62.506-52.702l0.32-1.86
          H193.179L193.499,459.298z" fill={filteredStyles.fill || "#3B4559"} />
        <path d="M469.782,371.98c-5.126-5.128-10.349-9.464-15.402-13.661c-21.252-17.648-39.608-32.888-39.608-96.168v-50.194
          c0-73.808-51.858-138.572-123.61-154.81c2.876-5.64,4.334-11.568,4.334-17.655C295.496,17.718,277.777,0,255.995,0
          c-21.776,0-39.492,17.718-39.492,39.492c0,6.091,1.456,12.018,4.334,17.655c-71.755,16.238-123.61,81.002-123.61,154.81v50.194
          c0,63.28-18.356,78.521-39.608,96.168c-5.052,4.196-10.276,8.533-15.402,13.661l-0.466,0.466v49.798h428.496v-49.798
          L469.782,371.98z" fill={filteredStyles.fill || "#3B4559"} />
      </g>
    </svg>
  )
}