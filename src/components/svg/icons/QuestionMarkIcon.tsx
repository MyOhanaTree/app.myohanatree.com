import React from "react";

export default function QuestionMarkIcon(props?: any) {

  const svgStyles: any = {
    width: props.width ? props.width : null,
    height: props.height ? props.height : null,
    fill: props.fill ? props.fill : null,
    margin: props.margin ? props.margin : null,
    background: props.background ? props.background : null,
    borderRadius: props.borderRadius ? props.borderRadius : null,
    padding: props.padding ? props.padding : null,
  };

  const filteredStyles = Object.keys(svgStyles)
  .filter(key => svgStyles[key] !== null && svgStyles[key] !== undefined)
  .reduce((acc: any, key) => {
    acc[key] = svgStyles[key];
    return acc;
  }, {});

  return (
    <svg 
      viewBox="0 0 100 200" 
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M49 28C37.4024 28 28 37.402 28 49C28 56.7319 21.7317 63 14 63C6.26808 63 0 56.7319 0 49C0 21.938 21.9389 0 49 0C76.0611 0 98 21.938 98 49C98 62.269 92.708 74.3307 
      84.1493 83.1413C82.4264 84.9128 80.7837 86.5555 79.2157 88.1216C75.1875 92.1461 71.6576 95.6723 68.5608 99.652C64.4728 104.905 63 108.767 63 112V126C63 133.732 56.7317 140 
      49 140C41.2683 140 35 133.732 35 126V112C35 99.7696 40.6933 89.8688 46.4651 82.4544C50.7341 76.9683 56.1008 71.6109 60.4576 67.2646C61.7717 65.9533 62.9925 64.7339 64.064 
      63.6304C67.7525 59.8347 70 54.6941 70 49C70 37.402 60.5976 28 49 28Z" fill={filteredStyles.fill || "#3B4559"}/>
      <path d="M49 200C59.4937 200 68 191.718 68 181.5C68 171.282 59.4937 163 49 163C38.5063 163 30 171.282 30 181.5C30 191.718 38.5063 200 49 200Z" fill={filteredStyles.fill || "#3B4559"}/>
    </svg>
  )
}
