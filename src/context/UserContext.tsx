import React, { createContext, useContext, useState, useEffect } from "react";

// Create UserContext
const UserContext = createContext<any>(null);

// Create a custom hook for accessing user data
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientName, setClientName] = useState<string | null>(null);

  // On mount, check localStorage for existing clientName
  useEffect(() => {
    const storedClientName = localStorage.getItem("clientName");
    if (storedClientName) {
      setClientName(storedClientName);
      console.log("Stored clientName:", storedClientName);
    }
  }, []);

  // Function to set clientName in both context and localStorage
  const updateClientName = (name: string) => {
    setClientName(name);
    localStorage.setItem("clientName", name); // Store the name in localStorage
  };

  return (
    <UserContext.Provider
      value={{ clientName, setClientName: updateClientName }}
    >
      {children}
    </UserContext.Provider>
  );
};
