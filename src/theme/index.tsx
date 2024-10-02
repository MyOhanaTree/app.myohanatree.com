import React from "react";
import { ThemeUIProvider } from "theme-ui"

import { themevals } from "./themevals";

const Theme = ({ children }: any) => {
	return (
		<ThemeUIProvider theme={themevals}>
			{children}
		</ThemeUIProvider>
	);
};

export default Theme;