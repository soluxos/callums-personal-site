"use client";
import { createContext, useContext, useState } from "react";

const EditModeContext = createContext({ editMode: false, setEditMode: () => {} });

export const useEditMode = () => useContext(EditModeContext);

export default function EditModeProvider({ children }) {
  const [editMode, setEditMode] = useState(false);
  return (
    <EditModeContext.Provider value={{ editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}
