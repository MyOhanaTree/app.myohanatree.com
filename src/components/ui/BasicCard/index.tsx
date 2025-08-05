import React from "react";
import { Card } from "theme-ui";

import { CardBody, CardHeader, CardTitle, CardFooter, CardWrap } from "./styled";

const BasicCard = ({
  children,
  title,
  actions,
  footer,
  sx,
}: {
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  sx?: any;
}) => {
  return (
    <CardWrap sx={sx}>
      <Card className="cardBox" sx={{ height: "100%" }}>
        {title && (
          <CardHeader className="cardHeader">
            <CardTitle className="cardTitle">{title}</CardTitle>
            {actions}
          </CardHeader>
        )}
        <CardBody className="cardBody">{children}</CardBody>
        {footer && <CardFooter className="cardFooter">{footer}</CardFooter>}
      </Card>
    </CardWrap>
  );
};

export default BasicCard;
