import React from "react";

export default function ProfileIcon(props?: any) {

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
      viewBox="0 0 40 40" 
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="18" stroke={filteredStyles.fill || "#3B4559"} strokeWidth={2}/>
      <mask id="mask0_75_1232" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
        <circle cx="20" cy="20" r="18" fill={filteredStyles.fill || "#3B4559"} />
      </mask>
      <g mask="url(#mask0_75_1232)">
        <path d="M20.5017 11.228C16.2727 11.228 12.8322 14.6685 12.8322 18.8974C12.8322 23.1264 16.2727 26.5668 20.5017 26.5668C24.7306 26.5668 28.1711 23.1264 28.1711 18.8974C28.1711 14.6685 24.7306 11.228 20.5017 11.228Z" fill={filteredStyles.fill || "#3B4559"} />
        <path 
          d="M30.0439 31.5774C27.9442 29.4455 25.1606 28.2714 22.206 28.2714H18.7973C15.8427 28.2714 13.0591 29.4455 10.9594 31.5774C8.86999 33.699 7.7193 36.4994 7.7193 39.463C7.7193 39.9336 8.10084 40.3152 8.57146 
          40.3152H32.4318C32.9025 40.3152 33.284 39.9336 33.284 39.463C33.284 36.4994 32.1333 33.699 30.0439 31.5774Z" fill={filteredStyles.fill || "#3B4559"}
        />
      </g>
    </svg>
  )
}