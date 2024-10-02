import React from "react";

export default function InfoIcon(props?: any) {

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
      viewBox="0 0 113 113"
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M56.5 0C25.3459 0 0 25.3462 0 56.5003C0 87.6544 25.3459 113 56.5 113C87.6541 113 113 87.6544 113 56.5003C113 25.3462 87.6541 0 56.5 0ZM56.5 102.727C31.0099 
      102.727 10.2727 81.9901 10.2727 56.5003C10.2727 31.0106 31.0099 10.2727 56.5 10.2727C81.9901 10.2727 102.727 31.0106 102.727 56.5003C102.727 81.9901 81.9897 102.727 
      56.5 102.727Z" fill={filteredStyles.fill || "#3B4559"} />
      <path d="M56.4992 23.9695C52.7236 23.9695 49.6521 27.0431 49.6521 30.8211C49.6521 34.5957 52.7236 37.6665 56.4992 37.6665C60.2748 37.6665 63.3463 34.5957 63.3463 
      30.8211C63.3463 27.0431 60.2748 23.9695 56.4992 23.9695Z" fill={filteredStyles.fill || "#3B4559"} />
      <path d="M56.4999 47.9396C53.6632 47.9396 51.3635 50.2393 51.3635 53.0759V83.8941C51.3635 86.7308 53.6632 89.0305 56.4999 89.0305C59.3365 89.0305 61.6363 86.7308 61.6363 
      83.8941V53.0759C61.6363 50.2393 59.3365 47.9396 56.4999 47.9396Z" fill={filteredStyles.fill || "#3B4559"} />
    </svg>
  )
}