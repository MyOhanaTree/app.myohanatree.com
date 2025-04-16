import React from "react";
import { ErrorWrap } from "./styled";
import { useThemeUI } from "theme-ui";

const ServerErrorPage = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;

  return (
    <ErrorWrap>
      <div>
        <h1>500 - Internal Error</h1>
        <p>Oops! something seams to be broken here</p>
      </div>
    </ErrorWrap>
  );
};

export default ServerErrorPage;
