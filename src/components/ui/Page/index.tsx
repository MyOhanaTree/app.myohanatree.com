import React, { ReactNode } from "react";
import { ThemeUIStyleObject, Box } from "theme-ui";
import styled from "styled-components";

export const PageWrapper = styled(Box)`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
  @media (max-width: 991px) {
    padding: 10px;
  }
`;

interface PageProps {
  children: ReactNode;
  sx?: ThemeUIStyleObject;
}

const Page: React.FC<PageProps> = ({ children, sx }) => {
  return (
    <PageWrapper sx={sx}>
      {children}
    </PageWrapper>
  );
};

export default Page;