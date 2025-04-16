import React from "react";
import { ErrorWrap } from "./styled";
import { useThemeUI } from "theme-ui";

const NotFoundPage = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;

  return (
    <ErrorWrap>
      <div>
        <h1>404 - Not Found</h1>
        <p>Oops! The page you&apos;re looking for does not exist.</p>
      </div>
    </ErrorWrap>
  );
};

export default NotFoundPage;
