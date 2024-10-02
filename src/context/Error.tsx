import React, { createContext, useContext, useState } from "react";

const ErrorContext: any = createContext<any>(null);

export const useError = () => {
  return useContext<any>(ErrorContext);
};

export const ErrorProvider = ({ children }: any) => {
  const [error, setError] = useState<any>(false);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};