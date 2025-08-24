import React, { createContext, useContext } from "react";

type GlobalContextProps = {};

const GlobalContext = createContext({} as GlobalContextProps);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);
