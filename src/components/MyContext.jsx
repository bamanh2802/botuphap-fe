import React, { createContext, useState } from 'react';

export const MyContext = createContext(null);

export const MyContextProvider = ({ children }) => {
  const [value, setValue] = useState("some value");

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};
