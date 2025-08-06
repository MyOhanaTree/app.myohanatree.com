import React from "react";
import { PageWrapper } from "./styled";

const Page = ({children}: any) =>{
  return (
    <PageWrapper>
      {children}
    </PageWrapper>
  )
}

export default Page;