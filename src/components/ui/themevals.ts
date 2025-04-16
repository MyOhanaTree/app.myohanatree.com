import { darken } from "helpers/default";

const baseButton = (color: any = "primary", outline?: boolean) => {
  return {
    "&  > *": {
      flexShrink: 0
    },
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",    
    gap: "10px",
    border: '1px solid transparent',
    borderRadius: "6px",
    transition: "all 0.3s",
    paddingX: "1.5rem",
    paddingY: "0.375rem",
    fontWeight: 500,
    lineHeight: 1.5, 
    minWidth: "auto", 
    ...(outline ? 
      {
        color: color,
        borderColor: color,
        backgroundColor: "transparent",
        "&:hover,&.active": {
          color: "#ffffff",
          backgroundColor: color,
          borderColor: color,
          svg : {
            fill: "#ffffff",
            stroke: "#ffffff",
            path: { 
              fill: "#ffffff",
              stroke: "#ffffff",
            },                
          }
        },
        svg : {
          fill: color,
          stroke: color,
          path: { fill: color, stroke: color, },    
          height: 14,
          width: 14,
        }
      } : {
        color: "#ffffff",
        backgroundColor: color,
        borderColor: "transparent",
        "&:disabled": { opacity: 0.75, cursor: "initial" },
        "&:focus": { outline: "none" },
        "&:hover,&.active": {
          backgroundColor: "hover." + color,
          borderColor: "hover." + color,          
        },
        svg : {
          height: 14,
          width: 14,
          fill: "#ffffff",
          stroke: "#ffffff",
          path: { 
            fill: "#ffffff",
            stroke: "#ffffff",
          },                          
        }
      }
    ),    
  }
};

const baseBadge = (color: any = "primary", sm?: boolean) => ({  
  display: "inline-block",
  borderRadius: sm ? "5px" : "50rem",
  fontWeight: "500",
  paddingX: sm ? ".25rem" : "1.75rem",  
  paddingY: sm ? ".125rem" : ".5rem",  
  color: "#fff",
  backgroundColor: color,
  userSelect : "none" as const,
  textAlign: "center" as const,
  lineHeight: 1
});

export const themevals = {
  breakpoints: ['991px'],
  colors: {
    primary: "#2D3648",
    secondary: "#717D96",
    base_100: "#F7F9FC",
    base_200: "#EDF0F7",
    base_300: "#E2E7F0",
    base_400: "#CBD2E0",
    base_500: "#A0ABC0",
    base_600: "#717D96",
    base_700: "#4A5468",
    base_800: "#2D3648",
    success: "#68B15C",
    danger: "#EA1A4C",
    warning: "#b28d1d",
    info: "#3c99d0",    
    red: "#EA1A4C",
    green: "#059669",    
    blue: "#34AFF7",  
    purple: "#8B5CF6", 
    orange: "#FFA500", 
    white: "#FFFFFF",
    body: "#4A5468",
    text: "#2D3648",
    hover: {
      primary: darken(-40,"#2D3648"),
      secondary: darken(-40,"#717D96"),      
      success: darken(40,"#68B15C"),      
      danger: darken(40,"#EA1A4C"),
      warning: darken(40,"#b28d1d"),
      info: darken(40,"#3c99d0"),
      red: darken(40,"#EA1A4C"),
      green: darken(40,"#059669"),      
      blue: darken(40,"#34AFF7"),
      purple: darken(40,"#8B5CF6"),
      orange: darken(40,"#FFA500"),
      white: darken(40,"#FFFFFF"),           
    },    
  },
  fonts: {
    body: "Inter, sans-serif",
    bold: "Work Sans Semi, sans-serif",
    medium: "Work Sans Medium, sans-serif",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    light: 300,
    body: 400,
    medium: 500,
    semi: 600,
    bold: 700,
    bolder: 900,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  borders: [0, 6, 12, 24],
  styles: {
    root: {
      fontFamily: "body",
      a: {
        color: "primary",
        fontFamily: "body",
        "&:hover": {
          color: "secondary",
        },
      },
      h1: {
        fontSize: "26px",
        mt: 0,
        mb: 0,
      },
    },
    hr: {
      margin: ".75rem 0",
      color: "#BECAD8",
    }
  },
  text: {
    truncate : {
      display: "inline-block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "300px"
    },
    heading: {
      fontFamily: 'body'
    },
    muted: {
      color: "#a9b3bf",
      fontWeight: 500,           
    },
    primary: {
      color: "#254778",
      fontWeight: 500,
    },
    secondary: {
      color: "#4893F7",
      fontWeight: 500,
    },
  },
  forms: {
    label : {
      color: "body",
      marginBottom: 0,
      display: "flex",
      gap : ".5rem",
      alignItems: "flex-end",
      fontWeight: 500,
      fontSize: 14,
    },
    input: {
      display: "inline-block",
      borderRadius: 0,
      borderLeft: "none",
      borderRight: "none",
      borderTop: "none",
      padding: "6px 0",
      color: "#254778",
      borderColor: "#BECAD8",
    },
    switch: {
      backgroundColor: "base_400",
    },
    checkbox: {
      width: 20,
      height: 20,
    },
    select: {
      fontFamily: "Work Sans",
      color: "primary",
      borderRadius: 0,
      borderColor: "#A9B3BF",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      padding: "8px 0 4px 0",
      fontSize: 14,
      fontWeight: 500,
      "& + svg": {
        fill: "#A9B3BF",
      },
    },
  },
  buttons: {
    primary: baseButton("primary"),
    secondary: baseButton("secondary"),
    success: baseButton("success"),      
    danger: baseButton("danger"),      
    warning: baseButton("warning"),      
    info: baseButton("info"),      
    red: baseButton("red"),      
    green: baseButton("green"),      
    blue: baseButton("blue"),      
    purple: baseButton("purple"),      
    orange: baseButton("orange"),   
    outline: {
      primary: baseButton("primary", true),
      secondary: baseButton("secondary", true),
      success: baseButton("success", true),      
      danger: baseButton("danger", true),      
      warning: baseButton("warning", true),      
      info: baseButton("info", true),      
      red: baseButton("red", true),      
      green: baseButton("green", true),      
      blue: baseButton("blue", true),      
      purple: baseButton("purple", true),      
      orange: baseButton("orange", true),        
    },
    white: {
      ...baseButton("white"),
      color: "body",
      borderColor: "base_300",
      svg: {
        height: 14,
        width: 14,
        fill: "body",
        path: { fill: "body" },
      },
    }, 
    icon: {
      background: "none",
      color: "body",
      border: "none",
      padding: "0",
      svg: {
        fill: "body",
        path: { fill: "body" },
        "&:hover": {
          fill: "base_600",
          path: { fill: "base_600" },
        }
      },
    },         
  },
  badges: {
    primary: baseBadge("primary"),    
    success: baseBadge("success"),          
    danger: baseBadge("danger"),
    info: baseBadge("info"),
    warning: baseBadge("warning"),
    red: baseBadge("red"),
    green: baseBadge("green"),
    blue: baseBadge("blue"),
    purple: baseBadge("purple"),
    orange: baseBadge("orange"),  
    grey: baseBadge("base_600"),   
    bell : {
      ...baseBadge("danger"),
      fontSize: 12,
      paddingX: ".5rem",  
      paddingY: ".25rem",  
    },
    sm: {
      primary: baseBadge("primary", true),
      secondary: baseBadge("secondary", true),
      success: baseBadge("success", true),      
      danger: baseBadge("danger", true),      
      warning: baseBadge("warning", true),      
      info: baseBadge("info", true),      
      red: baseBadge("red", true),      
      green: baseBadge("green", true),      
      blue: baseBadge("blue", true),      
      purple: baseBadge("purple", true),      
      orange: baseBadge("orange", true),        
    },
    dot : {
      primary: {...baseBadge("primary"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},    
      success: {...baseBadge("success"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},            
      danger: {...baseBadge("danger"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
      info: {...baseBadge("info"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
      warning: {...baseBadge("warning"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
      red: {...baseBadge("red"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
      green: {...baseBadge("green"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
      blue: {...baseBadge("blue"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
      purple: {...baseBadge("purple"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
      orange: {...baseBadge("orange"), textIndent: "-1000px", minWidth: "8px",width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
      grey: {...baseBadge("base_600"), textIndent: "-1000px", minWidth: "8px", width: "8px", height: "8px", borderRadius: "8px", padding: 0, overflow: "hidden"},  
    }      
  },
  links : {
    back : {
      fontSize: 14,
      textDecoration: "none",      
      lineHeight: "20px",
      marginBottom: 30,
      display: "inline-flex",
      gap: "10px",
      color: "dkgrey",
      "svg" : {
        width: "20px",
        fill: "dkgrey",
        path : { fill: "dkgrey" }
      },
      "&:hover" : {
        color: "base_800",
        "svg" : {
          fill: "base_800",
          path : { fill: "base_800" }
        }
      }
    }
  },
  cards: {
    primary: {
      background: "#ffffff",
      borderRadius: 6,
      boxShadow: '0px 4px 12px 0px rgba(113, 125, 150, 0.05)',
      border: "1px solid",
      borderColor: "base_300",
    },
    compact: {
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'muted',
    },
  },
};