import React from "react";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap";
import { CardWrap } from "./styled";
import { useThemeUI } from "theme-ui";


const BasicCard = (props?: any) => {

  const themeContext = useThemeUI();
  const { theme } = themeContext;

  return (
    <CardWrap $customStyles={props.customStyles} theme={theme}>
      <Card>
        {props.title &&              
          <CardHeader>
            <CardTitle tag="h5">
              {props.title}                
            </CardTitle>
            {props.actions}
          </CardHeader>
        }                        
        <CardBody>
          {props.children}
        </CardBody>
        {props.footer && 
          <CardFooter>
            {props.footer}
          </CardFooter>
        }
      </Card>
    </CardWrap>
  );
};

export default BasicCard;
