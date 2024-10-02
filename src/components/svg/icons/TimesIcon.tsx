import React from "react";

export default function TimesIcon(props?: any) {

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
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M99.8661 12.4375C102.711 9.59224 102.711 4.97918 99.8661 2.13394C97.0208 -0.711312 92.4078 -0.711312 89.5625 2.13394L51 40.6964L12.4375 2.13394C9.59224 -0.711312 4.97918 -0.711312 2.13394 2.13394C-0.711312 4.97918 
      -0.711312 9.59224 2.13394 12.4375L40.6964 51L2.13394 89.5625C-0.711312 92.4078 -0.711312 97.0208 2.13394 99.8661C4.97918 102.711 9.59224 102.711 12.4375 99.8661L51 61.3036L89.5625 99.8661C92.4078 102.711 97.0208 102.711 
      99.8661 99.8661C102.711 97.0208 102.711 92.4078 99.8661 89.5625L61.3036 51L99.8661 12.4375Z" fill={filteredStyles.fill || "#3B4559"} />
    </svg>
  )
}