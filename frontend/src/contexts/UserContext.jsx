import { createContext } from "react";

export const UserContext = createContext(null);
export const StudentContext = createContext({
  selectedStudent: null,
  setSelectedStudent: () => {},
});
export const SubjectContext = createContext({
  selectedSubject: null,
  setSelectedSubject: () => {},
});
