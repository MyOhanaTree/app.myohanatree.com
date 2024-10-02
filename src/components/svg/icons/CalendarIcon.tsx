import React from "react";

export default function CalendarIcon(props?: any) {

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
      viewBox="0 0 102 112"
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M76.5 5.09091C76.5 2.27928 74.2167 0 71.4 0C68.5833 0 66.3 2.27928 66.3 5.09091V10.1818H35.7V5.09091C35.7 2.27928 33.4167 0 30.6 
      0C27.7833 0 25.5 2.27928 25.5 5.09091V10.1818H15.3C6.85004 10.1818 0 17.0197 0 25.4545V96.7273C0 105.162 6.85004 112 15.3 112H86.7C95.15 112 102 105.162 102 96.7273V25.4545C102 
      17.0197 95.15 10.1818 86.7 10.1818H76.5V5.09091ZM91.8 40.7273V25.4545C91.8 22.6429 89.5166 20.3636 86.7 20.3636H76.5V25.4545C76.5 28.2662 74.2167 30.5455 71.4 30.5455C68.5833 
      30.5455 66.3 28.2662 66.3 25.4545V20.3636H35.7V25.4545C35.7 28.2662 33.4167 30.5455 30.6 30.5455C27.7833 30.5455 25.5 28.2662 25.5 25.4545V20.3636H15.3C12.4833 20.3636 10.2 22.6429 
      10.2 25.4545V40.7273H91.8ZM10.2 50.9091H91.8V96.7273C91.8 99.5389 89.5166 101.818 86.7 101.818H15.3C12.4833 101.818 10.2 99.5389 10.2 96.7273V50.9091Z" fill={filteredStyles.fill || "#3B4559"} />
    </svg>
  )
}