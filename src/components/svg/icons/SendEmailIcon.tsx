import React from "react";

export default function SendEmailIcon(props?: any) {

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
      viewBox="0 0 118 118"
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M116.988 1.01272C116.01 0.0346115 114.542 -0.266151 113.259 0.247335L2.17321 44.6813C0.902173 45.1897 0.051053 46.4002 0.00219368 47.7685C-0.0464352 49.1365 0.716876 50.4043 1.9485 51.0017L45.7532 
      72.2466L66.9982 116.051C67.5776 117.246 68.7876 118 70.1079 118C70.1489 118 70.1902 117.999 70.2315 117.998C71.5993 117.949 72.8102 117.098 73.3183 115.827L117.753 4.74125C118.266 3.45708 117.965 1.9906 
      116.988 1.01272ZM12.0059 48.1951L100.189 12.922L47.6356 65.4752L12.0059 48.1951ZM69.8049 105.994L52.5246 70.3639L105.078 17.8107L69.8049 105.994Z" fill={filteredStyles.fill || "#3B4559"} />
    </svg>
  )
}