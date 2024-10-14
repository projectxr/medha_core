"use client";
import React, { createContext, useState, useContext } from "react";

interface SelectionContextType {
  language: string;
  setLanguage: (lang: string) => void;
  classNumber: string;
  setClassNumber: (classNum: string) => void;
  subject: string;
  setSubject: (sub: string) => void;
  dataContext: any;
  setDataContext: (sub: any) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState("English");
  const [classNumber, setClassNumber] = useState("6");
  const [subject, setSubject] = useState("Science");
  const [dataContext, setDataContext] = useState<any>();

  return (
    <SelectionContext.Provider
      value={{ language, setLanguage, classNumber, setClassNumber, subject, setSubject, dataContext, setDataContext }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};
