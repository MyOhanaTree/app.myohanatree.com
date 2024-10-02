import React from "react";

export default function PlugIcon(props?: any) {

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
      viewBox="0 0 102 100"
      style={{...filteredStyles, fill : "none"}}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M102 57.2516C102 54.3568 99.6469 52.0037 96.7521 52.0037H81.321C68.389 52.0037 57.9141 62.4577 57.8513 75.3693C57.8304 82.0957 53.0614 88.0724 46.3977 88.9052C38.401 89.9048 31.5704 
      83.6573 31.5704 75.8691V64.1238C43.5655 61.6871 52.6034 51.0872 52.6034 38.3634V25.0355C52.6034 23.1404 51.0831 21.6202 49.1882 21.6202H42.6701V5.14779C42.6701 2.56548 40.7958 0.274755 
      38.2344 0.0248568C35.2981 -0.266691 32.8199 2.04487 32.8199 4.93951V21.6202H19.8252V5.14779C19.8252 2.56548 17.951 0.274755 15.3687 0.0248568C12.4324 -0.245866 9.95428 2.04487 9.95428 
      4.93951V21.6202H3.41527C1.52021 21.6202 0 23.1404 0 25.0355V38.3634C0 51.0872 9.03796 61.6871 21.0331 64.1238V75.2648C21.0331 88.0724 30.9665 99.0053 43.7738 99.4842C57.2266 99.984 68.3471 
      89.197 68.3471 75.8482V75.6605C68.3471 68.3925 74.2407 62.5204 81.4873 62.5204H96.7312C99.6469 62.4995 102 60.1463 102 57.2516Z" fill={filteredStyles.fill || "#3B4559"} />
    </svg>
  )
}