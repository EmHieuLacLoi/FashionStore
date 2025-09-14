import React, { createContext, useContext, useState } from "react";

type GlobalContextProps = {
  lang: string;
  setLang: (lang: string) => void;
  token: string;
  setToken: (token: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const GlobalContext = createContext({} as GlobalContextProps);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState(localStorage.getItem("language") || "vi");
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <GlobalContext.Provider
      value={{ lang, setLang, token, setToken, isLoading, setIsLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
