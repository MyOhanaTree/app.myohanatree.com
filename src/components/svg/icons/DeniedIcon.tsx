import React from "react";

export default function DeniedIcon(props?: any) {

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
      viewBox="0 0 868 868" 
      fill="none" 
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M716.844 151.157C789.227 223.543 834 323.543 834 434C834 654.916 654.916 834 434 834C323.543 834 223.543 789.227 151.157 716.844M716.844 
      151.157C644.458 78.7716 544.458 34 434 34C213.086 34 34 213.086 34 434C34 544.458 78.7716 644.458 151.157 716.844M716.844 151.157L151.157 716.844" 
      stroke={filteredStyles.fill || "#3B4559"} strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
