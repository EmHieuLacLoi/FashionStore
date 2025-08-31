import React, { createContext, useContext, useState } from "react";

type GlobalContextProps = {
  lang: string;
  setLang: (lang: string) => void;
};

const GlobalContext = createContext({} as GlobalContextProps);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState(localStorage.getItem("language") || "vi");
  return (
    <GlobalContext.Provider value={{ lang, setLang }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
