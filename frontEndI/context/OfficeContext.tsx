import React, { createContext, useContext, useState } from "react";

interface OfficeContextType {
  officeId: string | null;
  setOfficeId: (id: string | null) => void;
}

const OfficeContext = createContext<OfficeContextType>({
  officeId: null,
  setOfficeId: () => {
    console.warn("setOfficeId called outside of provider");
  },
});

export const useOffice = () => useContext(OfficeContext);

export const OfficeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [officeId, setOfficeId] = useState<string | null>(null);

  console.log("🚀 OfficeProvider rendered. Current officeId:", officeId);

  return (
    <OfficeContext.Provider value={{ officeId, setOfficeId }}>
      {children}
    </OfficeContext.Provider>
  );
};
