import React, { createContext, useState } from "react";

const UserContext: any = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
	const [user, setUser] = useState<any>(null);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;