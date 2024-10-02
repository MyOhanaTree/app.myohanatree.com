import React from "react";
import { ErrorWrap } from "./styled";
import { useThemeUI } from "theme-ui";

const ForbiddenPage = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  
  return (
    <ErrorWrap theme={theme}>
      <div>
        <h1>403 - Forbidden</h1>
        <p>You don&apos;t have permission to access this page.</p>
      </div>
    </ErrorWrap>
  );
};

export default ForbiddenPage;
