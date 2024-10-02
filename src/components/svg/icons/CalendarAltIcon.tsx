import React from "react";

export default function CalendarAltIcon(props?: any) {

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
      viewBox="0 0 102 102" 
      fill="none" 
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_766_40)">
        <path d="M0.651856 75.7603L0.651611 75.7597C0.292189 74.7785 0.585883 73.6745 1.38621 72.9982C1.75976 72.6838 17.3087 59.1479 18.506 30.581H101.382C100.178 61.788 83.3769 76.2318 82.6757 
        76.8195C82.2286 77.1914 81.6648 77.3956 81.0811 77.3956H2.98384C1.94029 77.3956 1.00925 76.7402 0.651856 75.7603Z" fill={filteredStyles.fill || "#3B4559"} stroke={filteredStyles.fill || "#3B4559"} strokeWidth="1"/>
        <path d="M99.0115 12.1505H84.0694V9.16206C84.0694 7.48855 82.7545 6.17365 81.081 6.17365C79.4074 6.17365 78.0925 7.48855 78.0925 9.16206V12.1505H62.9512V9.16206C62.9512 7.48855 61.6363 
        6.17365 59.9628 6.17365C58.2893 6.17365 56.9744 7.48855 56.9744 9.16206V12.1505H42.0323V9.16206C42.0323 7.48855 40.7174 6.17365 39.0439 6.17365C37.3704 6.17365 36.0555 7.48855 36.0555 
        9.16206V12.1505H21.1134C19.4399 12.1505 18.125 13.4654 18.125 15.1389V24.1041H102V15.1389C102 13.4654 100.685 12.1505 99.0115 12.1505Z" fill={filteredStyles.fill || "#3B4559"}/>
        <path d="M86.8331 81.786C85.2104 83.1371 83.1734 83.8727 81.081 83.8727H18.125V92.8379C18.125 94.4897 19.4616 95.8263 21.1134 95.8263H99.0115C100.663 95.8263 102 94.4897 102 
        92.8379V59.3386C96.2382 73.474 88.1982 80.6434 86.8331 81.786Z" fill={filteredStyles.fill || "#3B4559"}/>
      </g>
      <defs>
        <clipPath id="clip0_766_40">
          <rect width="102" height="102" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}